<template>
  <div>
    <select-file
      :uploaded="uploaded"
      @addFiles="addInputFiles"
    />

    <div
      v-if="images.length"
      class="mt-4 mb-4"
    >
      <div>
        <v-btn
          v-show="!uploaded"
          :loading="loading"
          color="primary"
          large
          @click="upload"
        >
          <v-icon left>cloud_upload</v-icon>
          Start upload
        </v-btn>
        <v-progress-circular
          v-if="loading"
          :value="averageCompleted"
          size="44"
          color="green"
        >
          {{ averageCompleted }}%
        </v-progress-circular>
      </div>

      <v-btn
        v-show="uploaded"
        color="primary"
        large
        @click="reset"
      >
        <v-icon left>cancel</v-icon>
        Reset
      </v-btn>
    </div>

    <div v-show="images.length">
      <span class="display-1">Files to upload</span><br>
      Total size: {{ totalSize + (uploaded ? ' (on hosting)' : '') }}
    </div>

    <!--<v-alert-->
      <!--:value="!images.length"-->
      <!--type="info"-->
    <!--&gt;-->
      <!--Files will be displayed here-->
    <!--</v-alert>-->

    <v-container
      v-show="images.length"
      grid-list-sm
      fluid
    >
      <v-layout
        row
        wrap
        justify-center
      >
        <!--<transition-group name="fade" compo>-->
        <!--d-flex-->
        <v-flex
          v-for="(img, index) in images"
          :key="index"
          xs6
          sm3
        >
          <image-card
            :img="img"
            @removeFile="removeFile"
            @editFile="editFile"
          />
        </v-flex>
        <!--</transition-group>-->
      </v-layout>
    </v-container>

    <v-textarea
      v-show="uploaded"
      :value="images.map(i => i.link).join('\n')"
      class="mt-3"
      label="Links"
      rows="1"
      auto-grow
      box
    />

    <!--:edit-dialog="editDialog"-->
    <cropper-dialog
      v-model="editDialog"
      :editable-image="editableImage"
      :edit-save-loading="editSaveLoading"
      @stopEditFile="stopEditFile"
      @saveEditFile="saveEditFile"
      @setEditBlob="setEditBlob"
    />
  </div>
</template>

<script>
/* eslint-disable no-new */
import { clipboard } from 'electron'
import Mousetrap from 'mousetrap'
import { formatBytes } from '@/helpers.js'
import ImageCard from '@/components/ImageCard'
import SelectFile from '@/components/SelectFile'
import CropperDialog from '@/components/CropperDialog'

export default {
  name: 'Hello',
  components: { ImageCard, SelectFile, CropperDialog },
  data: () => ({
    images: [],
    // lastFromClipboard: null,
    loading: false,
    editSaveLoading: false,
    uploaded: false,
    editDialog: false,
    editableImage: null,
    editBlob: null
    // averageCompleted: null
  }),
  computed: {
    totalSize () {
      return formatBytes(
        Math.floor(
          this.images
            .filter(image => image.size)
            .reduce((accumulator, image) => accumulator + image.size, 0)
        )
      )
    },
    averageCompleted () {
      return Math.floor(
        this.images.reduce(
          (accumulator, image) =>
            accumulator + image.completed, 0) / this.images.length
      )
    }
  },
  mounted () {
    const insertFromClipboard = () => {
      const file = clipboard.readImage()
      const fileExists = !!file.toDataURL().split(',')[1]

      if (fileExists) {
        this.addClipboardFile(file)
      } else {
        new Notification('Clipboard is empty')
      }
    }

    Mousetrap.bind(['command+v', 'ctrl+v'], insertFromClipboard)

    this.$electron.ipcRenderer.on('print-screen', insertFromClipboard)
  },
  methods: {
    addInputFiles (imageOrImages) {
      const files = [...imageOrImages].map(file => ({
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        completed: null,
        file
      }))

      this.images.push(...files)
    },
    addClipboardFile (file) {
      // if (file === this.lastFromClipboard) {
      //   new Notification('Already exists', {
      //     body: `File ${file.name} already exists!`,
      //     icon: file.preview
      //   })
      //
      //   return
      // }

      const myFromClipboardIndex = this.images.filter(i => i.fromClipboard).length + 1 || 1
      const postfix = myFromClipboardIndex > 1 ? myFromClipboardIndex : ''

      this.images.push({
        preview: file.toDataURL(),
        // size: ,
        name: 'Clipboard ' + postfix,
        fromClipboard: true,
        completed: null
      })
      // this.lastFromClipboard = file
    },
    removeFile (file) {
      this.images = this.images.filter(i => file !== i)
    },
    // Редактирование
    editFile (file) {
      this.editDialog = true
      this.editableImage = file
    },
    stopEditFile () {
      this.editDialog = false
      this.editableImage = null
      this.editBlob = null
    },
    saveEditFile () {
      const fileReader = new FileReader()

      fileReader.onload = () => {
        const base64 = fileReader.result

        this.editableImage.preview = base64
        this.editableImage.size = this.editBlob.size
        this.editSaveLoading = false
        this.stopEditFile()

        new Notification('Image saved!', {
          silent: true,
          icon: base64
        })
      }
      fileReader.readAsDataURL(this.editBlob)
      this.editSaveLoading = true
    },
    setEditBlob ({ blob }) {
      this.editBlob = blob
    },
    async upload () {
      // ф-я для запроса к api
      const request = (image, base64) => {
        const onlyBase64 = base64.split(',')[1]

        return this.$post('https://api.imgur.com/3/image', {
          image: onlyBase64,
          type: 'base64'
        }, {
          // eslint-disable-next-line no-return-assign
          onUploadProgress: e =>
            image.completed = Math.floor(e.loaded / e.total * 100)
        })
      }
      // коллекция обещаний
      const promisesAPI = []

      // собирает base64 с файлов и делает для них обещания для запроса на сервер
      for (let image of this.images) {
        let file = image.file

        const promise = new Promise(resolve => {
          if (image.fromClipboard) {
            resolve(request(image, image.preview))
          } else {
            let reader = new FileReader()

            reader.onloadend = async () => {
              const base64 = reader.result

              resolve(request(image, base64))
            }
            reader.readAsDataURL(file)
          }
        })

        promisesAPI.push(promise)
      }

      // делаются зопросы на загрузку к API
      this.loading = true
      try {
        const apiResults = await Promise.all(promisesAPI)
        console.log(apiResults.map(i => i.data))

        // Add info from API results
        apiResults.forEach(({ data }, i) => {
          const img = this.images[i]

          img.link = data.link
          img.size = data.size
          img.completed = null
          this.uploaded = true
        })

        // Local storage
        const previous = JSON.parse(localStorage.getItem('uploaded')) || []
        const newVal = JSON.stringify(previous.concat(this.images))

        localStorage.setItem('uploaded', newVal)

        // Notification
        const notifiOptions = {}
        let notifyTitle

        if (apiResults.length === 1) {
          notifiOptions.icon = this.images[0].link
          notifyTitle = 'File uploaded successfully!'
        } else {
          notifyTitle = apiResults.length + ' files uploaded successfully!'
        }

        new Notification(notifyTitle, notifiOptions)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    reset () {
      this.images = []
      this.uploaded = false
    }
  }
}
</script>
