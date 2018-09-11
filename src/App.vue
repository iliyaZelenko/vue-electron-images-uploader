<template>
  <div id="app">
    <!--<link href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons' rel="stylesheet">-->
    <link
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
      rel="stylesheet"
    >

    <router-view/>
  </div>
</template>

<style lang="stylus">
  #app
    /*font-family 'Avenir', Helvetica, Arial, sans-serif*/
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    text-align center
    color #2c3e50

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 10px 10px #f1f1f1;
    border: solid 2px transparent;
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 10px 10px #939393;
    border: solid 2px transparent;
  }
</style>

<script>
export default {
  mounted () {
    this.$electron.ipcRenderer.on('tray-expand', (event, message) => {
      this.$router.push('/file')
    })
  }
}
</script>
