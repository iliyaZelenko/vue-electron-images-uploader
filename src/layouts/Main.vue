<template>
  <v-app>
    <!--<v-navigation-drawer app />-->
    <!--<v-toolbar app />-->
    <v-content>
      <v-alert
        :value="updateStatus"
        :type="alertType"
        class="mt-0"
      >
        {{ alertText }}

        <template v-if="progress">
          <v-progress-linear
            :value="progress.percent"
            color="primary"
            height="15"
          />
          Speed: {{ formatBytes(progress.bytesPerSecond) }} per second <br>
          {{ formatBytes(progress.transferred) }} / {{ formatBytes(progress.total) }}
        </template>
      </v-alert>

      <v-container fluid>
        <div id="nav">
          <router-link to="/">
            Home
          </router-link> |
          <router-link to="/file">
            Files
          </router-link>
        </div>

        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>

      </v-container>
    </v-content>
    <v-footer>
      <span class="ml-3">
        Author:
        <a href="https://github.com/iliyaZelenko">
          Ilya Zelenko
        </a>
      </span>
      <v-spacer/>

      {{ releaseName ? `Realease: ${releaseName}` + (releaseAt ? `(${releaseAt})`: '') : '' }}

    </v-footer>
  </v-app>
</template>

<style lang="stylus">
  #nav
    padding 30px
    a
      font-weight bold
      color #2c3e50
      &.router-link-exact-active
        color #42b983
</style>

<script>
import { formatBytes } from '@/helpers.js'

export default {
  data: () => ({
    updateStatus: null,
    alertType: null,
    alertText: null,
    releaseName: null,
    releaseDate: null,
    progress: null
  }),
  computed: {
    releaseAt () {
      return new Date(this.releaseDate).toLocaleDateString()
    }
  },
  created () {
    // this.$electron.remote.dialog.showMessageBox({
    //   type: 'question',
    //   buttons: ['Install and Relaunch', 'Later'],
    //   defaultId: 0,
    //   message: 'A new version of has been downloaded',
    //   detail: 'Привте'
    // }, response => {
    //   console.log(response)
    // })

    // this.$electron.remote.dialog.showOpenDialog(
    //   this.$electron.remote.getCurrentWindow(),
    //   {
    //     defaultPath: 'c:/',
    //     filters: [
    //       { name: 'All Files', extensions: ['*'] },
    //       { name: 'Images', extensions: ['jpg13232', 'png', 'gif'] },
    //       { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] }
    //     ],
    //     properties: ['openFile']
    //   }
    // )

    const alerts = {
      notAvailable: { type: 'info', msg: 'Update not available.' },
      available: { type: 'success', msg: 'Update available.' },
      download: { type: 'success', msg: 'Download update.' },
      downloadDone: { type: 'success', msg: 'Updates downloaded. It will be installed the next time you restart the application.' }
    }
    this.$electron.ipcRenderer.on('updater-message', (event, { status, info }) => {
      const { type: alertType, msg: alertText } = alerts[status]

      this.alertType = alertType
      this.alertText = alertText
      this.updateStatus = status

      if (status === 'notAvailable') {
        this.releaseName = info.releaseName // getVersion
        this.releaseDate = info.releaseDate
      }

      if (this.progress) {
        this.progress = null
      }
      console.log(status, info)
    })

    this.$electron.ipcRenderer.on('updater-progress', (event, progressObj) => {
      this.updateStatus = 'progress'
      this.progress = progressObj
    })
  },
  methods: {
    formatBytes
  }
}
</script>
