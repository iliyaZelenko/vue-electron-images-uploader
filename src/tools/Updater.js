import { app, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import * as path from 'path'

let window

export default function (globalWindow) {
  window = globalWindow

  // if (isDev) {
  autoUpdater.updateConfigPath = path.join(__dirname, '../app-update.yml')
  // }

  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'info'
  log.info('App starting...')

  autoUpdater.on('checking-for-update', () => {
    // sendStatusToWindow('Checking for update...')
  })
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('available', info)
  })
  autoUpdater.on('update-not-available', (info) => {
    // console.log(info)
    sendStatusToWindow('notAvailable', info)
  })
  autoUpdater.on('error', (err) => {
    dialog.showErrorBox('Error: ', err === null ? 'unknown' : (err.stack || err).toString())
    // sendStatusToWindow('error', err)
  })

  function sendStatusToWindow (status, info = null) {
    window.webContents.send('updater-message', { status, info })
  }

  autoUpdater.checkForUpdates() // checkForUpdatesAndNotify()
}

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?',
    buttons: ['Sure', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    }
  })
})

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  let message = app.getName() + ' ' + releaseName + ' is now available. It will be installed the next time you restart the application.'
  if (releaseNotes) {
    const splitNotes = releaseNotes.split(/[^\r]\n/)
    message += '\n\nRelease notes:\n'
    splitNotes.forEach(notes => {
      message += notes + '\n\n'
    })
  }
  // Ask user to update the app
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Relaunch', 'Later'],
    defaultId: 0,
    message: 'A new version of ' + app.getName() + ' has been downloaded',
    detail: message
  }, response => {
    if (response === 0) {
      setTimeout(() => autoUpdater.quitAndInstall(), 1)
    }
  })
})
