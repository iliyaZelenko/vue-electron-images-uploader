'use strict'

import { app, protocol, BrowserWindow, globalShortcut } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

import readyCallback from './tools/events/ready'
import closedCallback from './tools/events/closed'

const isDevelopment = process.env.NODE_ENV !== 'production'
if (isDevelopment) {
  // Don't load any native (external) modules until the following line is run:
  require('module').globalPaths.push(process.env.NODE_MODULES_PATH)
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

// const menubar = require('menubar')
//
// const mb = menubar({
//   dir: __static,
//   index: 'https://www.google.com/' // file:// + opts.dir + index.html
// })

// mb.on('ready', function ready () {
//   console.log('app is ready')
//   // your app code here
// })

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })
function createMainWindow () {
  const window = new BrowserWindow({
    // titleBarStyle: 'hidden',
    // skipTaskbar: true,
    // opacity: 0.5,
    // frame: false,
    icon: path.join(__static, 'icon.png'),
    width: 1000, // 1280
    height: 830 // 800 940
  })

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) window.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    )
    // dev on prod
    window.webContents.openDevTools()
  }

  window.on('closed', () => {
    mainWindow = null

    closedCallback()
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools()
  }
  mainWindow = createMainWindow()
  // 'http://icons.iconarchive.com/icons/umut-pulat/tulliana-2/128/system-tray-icon.png'
  // console.log(path.join(__dirname, 'images', 'logo.png')) path.join(__dirname, '../assets', 'logo.png')

  readyCallback(mainWindow)
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})

// process.argv.forEach(onOpen)
// app.on('open-file', onOpen)
// app.on('open-url', onOpen)
//
// function onOpen () {
//   app.setName('123')
//   // setInterval(app.setName, 1000, '123')
//   setInterval(() => {
//     app.setName('123')
//   }, 1000)
//   // app.moveToApplicationsFolder()
// }
