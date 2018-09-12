import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import * as path from 'path'

let window

export default function (globalWindow) {
  window = globalWindow

  // if (isDev) {
  console.log(path.join(__dirname, '../', 'app-update.yml'))
  autoUpdater.updateConfigPath = path.join(__dirname, '../', 'app-update.yml')
  // }

  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'info'
  log.info('App starting...')

  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...')
  })
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.')
  })
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.')
  })
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater: ' + err)
  })

  function sendStatusToWindow (msg) {
    console.log(msg)
    window.webContents.send('updater-message', msg)
  }

  autoUpdater.checkForUpdates() // checkForUpdatesAndNotify()
}
