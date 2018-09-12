import { app, BrowserWindow, Menu, Tray, ipcMain, globalShortcut } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import Positioner from 'electron-positioner'
import AutoLaunch from 'auto-launch'
import Updator from '../Updater'

const isDevelopment = process.env.NODE_ENV !== 'production'
let window, tray, trayWindow

export default function (mainWindow) {
  window = mainWindow

  autolaunch()
  windowEvents()
  createTray()
  shortcut()
  addMenu()
  Updator(window)
}

async function autolaunch () {
  let autoLaunch = new AutoLaunch({
    name: 'Vue + Electron Images Uploader',
    path: app.getPath('exe')
  })
  const isEnabled = await autoLaunch.isEnabled()

  if (!isEnabled) autoLaunch.enable()
}

function shortcut () {
  // globalShortcut.register('CommandOrControl+D', () => {
  //   console.log('CommandOrControl+D is pressed')
  //
  //   // window.webContents.send('ping', 'whoooooooh1!')
  // })

  globalShortcut.register('Alt+PrintScreen', () => {
    trayWindow.webContents.send('print-screen')
    showTrayWindow()
  })
  //
  // electronLocalshortcut.register(trayWindow, 'PrintScreen', () => {
  //   console.log(123)
  //   trayWindow.webContents.send('print-screen')
  //   showTrayWindow()
  // })
  //
  // electronLocalshortcut.register(window, 'Ctrl+C', () => {
  //   console.log('You pressed ctrl & C')
  // })
}

function addMenu () {
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function windowEvents () {
  // let window = window
  window.setOverlayIcon(path.join(__static, 'overlay.png'), 'Description for overlay')

  // my code
  window.on('minimize', function (event) {
    event.preventDefault()
    window.hide()
  })

  window.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault()
      window.hide()
    }

    return false
  })

  window.once('focus', () => window.flashFrame(false))

  // панель эскизов
  window.setThumbarButtons([
    {
      tooltip: 'button1',
      icon: path.join(__static, 'tray.png'),
      click () { console.log('button1 clicked') }
    }, {
      tooltip: 'button2',
      icon: path.join(__static, 'overlay.png'),
      flags: ['enabled', 'dismissonclick'],
      click () { console.log('button2 clicked.') }
    }
  ])
}

function createTray () {
  tray = new Tray(path.join(__static, 'tray.png'))

  // const win = new BrowserWindow({ width: 800, height: 600 })
  const createWindow = () => {
    trayWindow = new BrowserWindow({
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
      trayWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/file-tray')
      if (!process.env.IS_TEST) trayWindow.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      window.loadURL(
        formatUrl({
          pathname: path.join(__dirname, 'index.html#/file-tray'), // #/file-tray
          protocol: 'file',
          slashes: true
        })
      )
    }
    // trayWindow.loadURL(`file://${path.join('tray.html')}`)
    // Hide the window when it loses focus
    trayWindow.on('blur', () => {
      if (!trayWindow.webContents.isDevToolsOpened()) {
        trayWindow.hide()
      }
    })
  }

  const contextMenu = Menu.buildFromTemplate([
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

  const toggleWindow = () => {
    trayWindow.isVisible() ? trayWindow.hide() : showTrayWindow()
  }

  createWindow()

  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)

  tray.on('click', toggleWindow)

  ipcMain.on('tray-close', (event, arg) => {
    trayWindow.hide()
  })
  ipcMain.on('tray-expand', (event, arg) => {
    trayWindow.hide()
    window.show()
    window.webContents.send('tray-expand')
  })
  // win.hide()
  // win.on('show', () => {
  //   tray.setHighlightMode('always')
  // })
  // win.on('hide', () => {
  //   tray.setHighlightMode('never')
  // })
}

function showTrayWindow () {
  const positioner = new Positioner(trayWindow)
  const { x, y } = positioner.calculate('trayBottomCenter', tray.getBounds())

  trayWindow.show()
  trayWindow.setPosition(x - 17, y)
}

// async function delOneItem() {
//   // await driver.wait(until.elementLocated(By.name("remove_cart_item")), 5000)
//   await driver.findElement(By.name("remove_cart_item")).click()
//
//   return driver.wait(until.elementLocated(By.name("remove_cart_item")), 5000)
// }
//
// await delOneItem()
// await delOneItem()
// await delOneItem()

// async function delOneItem() {
//   await driver.wait(until.elementLocated(By.name("remove_cart_item")), 500)
//   await driver.findElement(By.name("remove_cart_item")).click()
//
//
// }
//
// await delOneItem()
// await delOneItem()
// await delOneItem()


// let times = 0
//
// async function delOneItem() {
//   await driver.wait(until.elementLocated(By.name("remove_cart_item")), 5000)
//   await driver.findElement(By.name("remove_cart_item")).click()
//
//   if (++times <= 4) {
//     await delOneItem()
//   }
// }
//
// await wait(5000)
//
// //  await delOneItem()
// // await delOneItem()
//
// await delOneItem()





