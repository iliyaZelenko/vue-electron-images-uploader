<template>
  <v-app>
    <!--<v-navigation-drawer app />-->
    <!--<v-toolbar app />-->
    <v-content>
      <v-alert
        :value="updateStatus"
        :type="alertType"
      >
        {{ alertText }}
      </v-alert>

      <v-container fluid>
        <div id="nav">
          <router-link to="/">
            Home
          </router-link> |
          <router-link to="/file">
            File
          </router-link>
        </div>

        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>

      </v-container>
    </v-content>
    <v-footer>
      <span class="ml-3">Author: Ilya Zelenko</span>
      <v-spacer/>

      {{ releaseName ? `Realease: ${releaseName} (${releaseAt})` : '' }}

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
export default {
  data: () => ({
    updateStatus: null,
    alertType: null,
    alertText: null,
    releaseName: null,
    releaseDate: null
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
      available: { type: 'success', msg: 'Update available.' }
    }
    this.$electron.ipcRenderer.on('updater-message', (event, { status, info }) => {
      const { type: alertType, msg: alertText } = alerts[status]

      this.alertType = alertType
      this.alertText = alertText
      this.updateStatus = status

      if (status === 'notAvailable') {
        this.releaseName = info.releaseName
        this.releaseDate = info.releaseDate
      }

      console.log(status, info)
    })
  }
}
</script>
