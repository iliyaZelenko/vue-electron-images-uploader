import { app, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import * as path from 'path'

let window
const isDev = process.env.NODE_ENV !== 'production'
// console.log(rootFolder)
// console.log(path.resolve(__static, '../'))

export default function (globalWindow) {
  window = globalWindow

  if (isDev) {
    const rootFolder = process.cwd()
    // const rootFolder = process.env.NODE_ENV === 'development'
    //   ? process.cwd()
    //   : path.resolve(app.getAppPath(), '../../')
    autoUpdater.updateConfigPath = path.join(rootFolder, './app-update.yml')
  }

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
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Found Updates',
      message: 'Found updates, do you want update now?',
      buttons: ['Sure', 'No']
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        sendStatusToWindow('download')
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

    // dialog.showMessageBox({
    //   title: 'Install Updates',
    //   message: 'Updates downloaded, application will be quit for update...'
    // }, response => {
    //   if (response === 0) {
    //     setImmediate(() => autoUpdater.quitAndInstall())
    //   }
    // })

    // Ask user to update the app
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Install and Relaunch', 'Later'],
      defaultId: 0,
      message: 'A new version of ' + app.getName() + ' has been downloaded',
      detail: message
    }, response => {
      if (response === 0) {
        setImmediate(() => autoUpdater.quitAndInstall())
      } else if (response === 1) {
        sendStatusToWindow('downloadDone')
      }
    })
  })

  autoUpdater.on('download-progress', progressObj => {
    // let logMessage = 'Download speed: ' + progressObj.bytesPerSecond
    // logMessage += ` - Downloaded ${progressObj.percent}%`
    // logMessage += ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    //
    // progressObj.percent
    window.webContents.send('updater-progress', progressObj)
  })

  function sendStatusToWindow (status, info = null) {
    window.webContents.send('updater-message', { status, info })
  }

  autoUpdater.checkForUpdates() // checkForUpdatesAndNotify()
}
