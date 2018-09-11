<template>
  <v-app>
    <!--<v-navigation-drawer app />-->
    <!--<v-toolbar app />-->
    <v-content>
      <v-container fluid>
        <v-btn
          color="primary"
          round
          @click="expand"
        >
          <v-icon left>open_in_new</v-icon>
          Expand
        </v-btn>
        <v-btn
          color="secondary"
          round
          @click="close"
        >
          <v-icon left>close</v-icon>
          Close
        </v-btn>
        <!--ipcRenderer.sendSync('synchronous-message', 'ping')-->

        <v-slide-y-transition mode="out-in">
          <router-view class="mt-2" />
        </v-slide-y-transition>
      </v-container>
    </v-content>
    <!--<v-footer>-->
    <!--<span class="ml-3">Author: Ilya Zelenko</span>-->
    <!--</v-footer>-->
  </v-app>
</template>

<script>
export default {
  methods: {
    close () {
      this.$electron.ipcRenderer.send('tray-close')
    },
    expand () {
      this.$electron.ipcRenderer.send('tray-expand')
    }
  }
}
</script>
