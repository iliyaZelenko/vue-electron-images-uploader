const { globalShortcut } = require('electron')

export default function () {
  globalShortcut.unregisterAll()
}
