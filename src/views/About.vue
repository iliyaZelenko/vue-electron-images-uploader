<template>
  <div class="about">
    <h1>These are your windows and screens of sources</h1>

    <h3 v-show="!selectedSource">
      Please, select source.
    </h3>

    <div class="source-wrap">
      <div
        v-for="(source, i) in sources"
        :key="i"
        :title="source.text"
        :class="{source: true, 'source--active': source === selectedSource}"
        @click="selectSource(source)"
      >
        <img
          :src="source.img"
          class="source__img"
          alt="Thumbnail"
        >
      </div>
    </div>

    <button
      v-if="selectedSource"
      class="capture-btn"
      @click="toggleDisplay()"
    >
      {{ desktopSharing ? 'Disable capture' : 'Enable capture' }}
    </button>

    <video autoplay />
  </div>
</template>

<script>
import { ipcRenderer, desktopCapturer } from 'electron'

export default {
  data: () => ({
    sources: [],
    selectedSource: null,
    desktopSharing: false,
    localStream: null
  }),
  methods: {
    addSource (source) {
      this.sources.push({
        value: source.id.replace(':', ''),
        text: source.name,
        img: source.thumbnail.toDataURL()
      })
    },
    showSources () {
      desktopCapturer.getSources({
        types: ['window', 'screen'],
        thumbnailSize: { width: 300, height: 300 }
      }, (error, sources) => {
        if (error) throw error

        for (let source of sources) {
          // console.log('Name: ' + source.name)
          this.addSource(source)
        }
      })
    },
    toggleDisplay () {
      if (this.desktopSharing) {
        this.desktopSharing = false
        document.querySelector('video').src = null

        if (this.localStream) {
          this.localStream.getTracks()[0].stop()
        }
        this.localStream = null
        // this.sources = []
        // this.showSources()
      } else {
        const id = this.selectedSource.value.replace(/window|screen/g, (match) => match + ':')
        this.onAccessApproved(id)
      }
    },
    selectSource (source) {
      if (this.selectedSource === source) {
        this.selectedSource = null
      } else {
        this.selectedSource = source

        if (this.desktopSharing) {
          this.toggleDisplay() // off
        }
      }
    },
    onAccessApproved (desktopId) {
      if (!desktopId) {
        throw Error('Desktop Capture access rejected.')
      }
      this.desktopSharing = true
      // document.querySelector('button').innerHTML = 'Disable Capture'
      console.log('Desktop sharing started.. desktop_id:' + desktopId)
      navigator.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: desktopId,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720
          }
        }
      }, stream => { // gotStream
        this.localStream = stream
        document.querySelector('video').src = URL.createObjectURL(stream)
        stream.onended = () => {
          if (this.desktopSharing) {
            this.toggleDisplay()
          }
        }
      }, e => { // getUserMediaError
        console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'))
      }) // or try catch
    }
  },
  created () {
    this.showSources()
    ipcRenderer.on('ping', (event, message) => {
      alert(message)
      console.log(message)
    })
  }
}
</script>

<style lang="stylus" scoped>
  video
    width: 100%;
    background: white url('../assets/logo.png') center no-repeat
    border: 1px solid #e2e2e2
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2)

  .source-wrap
    max-width: 100%
    display flex
    justify-content center
    align-items center
    flex-wrap wrap

  .source
    margin 10px
    cursor pointer

  .source--active
    outline 5px solid green !important

  .source__img
    /*width 100%*/
    /*height 100%*/
    display block
    outline 1px solid gray
    transition all .5s ease
    &:hover
      outline: 5px solid red

  .capture-btn
    font-size 30px
    margin-top 30px
    margin-bottom 30px

</style>
