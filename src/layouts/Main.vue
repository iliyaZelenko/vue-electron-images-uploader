<template>
  <v-app>
    <!--<v-navigation-drawer app />-->
    <!--<v-toolbar app />-->
    <v-content>
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
  created () {
    console.log(123)
    this.$electron.ipcRenderer.on('updater-message', (event, message) => {
      console.log(event, message)
    })
  }
}
</script>
