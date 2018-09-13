<template>
  <div>
    <div
      v-show="image.preview"
      style="display: flex; justify-content: center;"
    >
      <div style="display: inline-block; border: 3px solid #e3e3e3; border-radius: 4px;">
        <img
          ref="editor"
          :src="image.preview"
          style="display: block; max-width: 100%; max-height: 60vh;"
        >
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const cropperConfig = {
  // aspectRatio: 1, // 4 / 3,
  viewMode: 1,
  background: false,
  dragMode: 'move'
  // autoCropArea: 1, // default: 0.8
  // dragMode: 'move',
  // preview: this.$refs.avatarPreview,
  // zoomable: false,
  // zoomOnTouch: false
  // zoomOnWheel: false
}

export default {
  props: {
    image: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    // preview: null,
    // previewDefault: '123', // TODO
    cropperInstance: null,
    onCropTimeoutId: null
  }),
  mounted () {
    this.source = this.image.preview

    this.$nextTick(() => {
      this.cropperInstance = new Cropper(this.$refs.editor, {
        ...cropperConfig,
        crop: this.onCrop
      })
    })
  },
  methods: {
    onCrop (event) {
      if (this.onCropTimeoutId) {
        clearTimeout(this.onCropTimeoutId)
      }
      this.onCropTimeoutId = setTimeout(() => {
        this.cropperInstance.getCroppedCanvas({
          // должен использоваться  размер из конфига
          width: 600,
          height: 600
        }).toBlob(blob => {
          // URL.revokeObjectURL(this.preview) // очищает с памяти прошлый url
          // this.preview = URL.createObjectURL(blob)

          this.$emit('crop', {
            event,
            blob
          })
        })
      }, 50)
    }
  }
}
</script>

<style scoped>

</style>
