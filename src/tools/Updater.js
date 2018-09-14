import { app, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import * as path from 'path'

let window, checkForUpdatesInterval
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

  autoUpdater.autoDownload = false // скачивать вручную
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
    clearInterval(checkForUpdatesInterval)

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

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate) => {
    let message = `${app.getName()} ${releaseName || ''} + ' is now available. It will be installed the next time you restart the application.`
    if (releaseNotes) {
      const splitNotes = releaseNotes.split(/[^\r]\n/)
      message += '\n\nRelease notes:\n'
      splitNotes.forEach(notes => {
        message += notes + '\n\n'
      })
    }

    console.log(message, { releaseNotes, releaseName, releaseDate })

    // TODO убрать sendStatusToWindow
    dialog.showMessageBox({
      // ' + app.getName() + '
      title: 'A new version has been downloaded',
      message: 'Updates downloaded, application will be quit for update...'
    }, () => {
      setImmediate(() => autoUpdater.quitAndInstall())
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

  // check every minute
  checkForUpdatesInterval = setInterval(() => {
    autoUpdater.checkForUpdates() // checkForUpdatesAndNotify()
  }, 60 * 1000)
  autoUpdater.checkForUpdates()
}
