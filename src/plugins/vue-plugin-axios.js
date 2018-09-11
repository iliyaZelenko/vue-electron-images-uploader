import Vue from 'vue'
import VueAxios from 'vue-plugin-axios'
// import VueAxios from '@/../../vue-plugin-axios/dist/vue-plugin-axios.esm'
import axios from 'axios'

Vue.use(VueAxios, {
  axios,
  config: {
    headers: {
      'Authorization': 'Client-ID 4552a99edfb91a3'
    }
  },
  interceptors: {
    // this function shows how to add errors from server to client app
    beforeResponseError (error) {
      // console.log({ ...error })
      if (error.message) {
        alert(error.message)
      }

      if (error.response && error.response.data.message) {
        alert(error.response.data.message) // shows response error
      }

      return Promise.reject(error) // может и не надо
    }
  }
})
