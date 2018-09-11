module.exports = {
  presets: [
    // [
    //   '@babel/preset-env', {
    //     useBuiltIns: 'entry' // из-за vuetify
    //   }
    // ],
    ['@vue/app', {
      useBuiltIns: 'entry' // из-за vuetify
    }] // https://www.npmjs.com/package/@vue/babel-preset-app#usebuiltins
  ]
}
