# Images Uploader

<img src="https://i.imgur.com/jNWx1Us.png" width="240" height="210">
<img src="https://i.imgur.com/CWb72F5.png" width="240" height="210">
<img src="https://i.imgur.com/dq1EnFB.png" width="240" height="210">
<img src="https://i.imgur.com/JyW6TO6.png" width="240" height="210">
<img src="https://i.imgur.com/11kHBgR.png" width="240" height="210">
<img src="https://i.imgur.com/kLXOxhf.png" width="240" height="210">


## Features
- Selecting pictures from Explorer or Clipboard
- Editing before downloading
- Download progress
- Download on hosting imgur.com as an anonymous author
- Selecting files via trait(`Command or Ctrl + Q`)
- electron-updater with progress and auto check every minute
- Vue CLI 3 + Vuetify + (vue-cli-plugin-electron-builder)[https://github.com/nklayman/vue-cli-plugin-electron-builder]

## Project setup
```
yarn install
```

### To start a development server:

If you use [Yarn](https://yarnpkg.com/en/) (strongly recommended):

`yarn serve:electron`

or if you use NPM:

`npm run serve:electron`

### To build your app:

With Yarn:

`yarn build:electron`

or with NPM:

`npm run build:electron`

### electron-updater with github:

Generate a GitHub access token by going to https://github.com/settings/tokens/new. The access token should have the repo scope/permission. Once you have the token, assign it to an environment variable

On macOS/linux:

`export GH_TOKEN="<YOUR_TOKEN_HERE>"`

On Windows, run in powershell:

`[Environment]::SetEnvironmentVariable("GH_TOKEN","<YOUR_TOKEN_HERE>","User")`

Make sure to restart IDE/Terminal to inherit latest env variable.


Change the settings in ***app-update.yml***:
```
provider: github
owner: iliyaZelenko
repo: vue-electron-images-uploader
```

Publish for your platform with:
`publish:electron`

If you want to publish for more platforms, edit the `publish:electron` script in package.json.
