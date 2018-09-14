import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import Positioner from 'electron-positioner'

const isDevelopment = process.env.NODE_ENV !== 'production'
let window, trayObj

export default {
  trayWindow: null,
  tray: null,
  init (globalWindow) {
    window = globalWindow
    trayObj = this
    this.tray = new Tray(path.join(__static, 'tray.png'))
    this.tray.setToolTip('This is my application.')
    this.tray.setContextMenu(getTrayMenu())
    this.tray.on('click', this.toggleWindow)

    ipcMain.on('tray-close', (event, arg) => {
      this.trayWindow.hide()
    })
    ipcMain.on('tray-expand', (event, arg) => {
      this.trayWindow.hide()
      window.show()
      window.webContents.send('tray-expand')
    })

    this.createWindow()

    return this
  },
  toggleWindow () {
    trayObj.trayWindow.isVisible() ? trayObj.trayWindow.hide() : trayObj.showTrayWindow()
  },
  showTrayWindow () {
    const positioner = new Positioner(this.trayWindow)
    const { x, y } = positioner.calculate('trayBottomCenter', this.tray.getBounds())

    this.trayWindow.show()
    this.trayWindow.setPosition(x - 17, y)
  },
  createWindow () {
    this.trayWindow = new BrowserWindow({
      width: 520, // 320
      height: 440,
      show: false,
      frame: false,
      fullscreenable: false,
      resizable: false,
      alwaysOnTop: true
      // transparent: true
    })

    if (isDevelopment) {
      // Load the url of the dev server if in development mode
      this.trayWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/file-tray')
      if (!process.env.IS_TEST) this.trayWindow.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      // __dirname
      this.trayWindow.loadURL(path.join(__dirname, 'index.html') + '#/file-tray')
      // this.trayWindow.loadURL(
      //   formatUrl({
      //     pathname: path.join(__static, 'index.html') + '#/file-tray', // #/file-tray
      //     protocol: 'file',
      //     slashes: true
      //   })
      // )
      // this.trayWindow.webContents.openDevTools()
    }
    // trayWindow.loadURL(`file://${path.join('tray.html')}`)
    // Hide the window when it loses focus
    this.trayWindow.on('blur', () => {
      if (!this.trayWindow.webContents.isDevToolsOpened()) {
        this.trayWindow.hide()
      }
    })
  }
}

function getTrayMenu () {
  return Menu.buildFromTemplate([
    {
      label: 'Show App',
      click () {
        window.show()
      }
    },

    {
      label: 'Flash frame',
      click () {
        window.flashFrame(true)
      }
    },
    {
      label: 'Actions',
      submenu: [
        {
          label: 'Open Google',
          click (item, window, event) {
            // console.log(item, event);

            // const icons = new BrowserWindow({
            //   show: true, webPreferences: { offscreen: true }
            // })
            // icons.loadURL("https://trends.google.com/trends/hottrends/visualize")
            // icons.webContents.on("paint", (event, dirty, image) => {
            //   if (tray) tray.setImage(image.resize({ width: 16, height: 16 }))
            // })
          }
        },
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
      ]
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click () {
        app.isQuiting = true
        app.quit()
      }
    }
  ])
}
