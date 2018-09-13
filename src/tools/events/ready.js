import { app, Menu, globalShortcut } from 'electron'
import * as path from 'path'
import AutoLaunch from 'auto-launch'
import Updator from '../Updater'
import Tray from '../Tray'

// const isDevelopment = process.env.NODE_ENV !== 'production'
let window, trayObj

export default function (mainWindow) {
  window = mainWindow

  autolaunch()
  windowEvents()
  trayObj = Tray.init(window)
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

  // 'Alt+PrintScreen'
  globalShortcut.register('CommandOrControl+Q', () => {
    trayObj.trayWindow.webContents.send('print-screen')
    trayObj.showTrayWindow()
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





