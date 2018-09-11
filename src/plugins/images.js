import Vue from 'vue'
import VueAxios from 'vue-plugin-axios'
// import VueAxios from '@/../../vue-axios-wrapper/src/'
import axios from 'axios'

Vue.use(VueAxios, {
  axios,
  config: {
    headers: {
      'Authorization': 'Client-ID 4552a99edfb91a3'
    }
    // baseURL: 'http://localhost:8000/', // api URL
  },
  interceptors: {
    // beforeRequest (config, axiosInstance) {
    //   config.headers.Authorization = `Client-ID 4552a99edfb91a3`
    // },
    // this function shows how to add errors from server to client app
    beforeResponseError (error) {
      if (error.response.data.message) {
        alert(error.response.data.message) // shows response error
      }
      return Promise.reject(error)
    }
  }
})
