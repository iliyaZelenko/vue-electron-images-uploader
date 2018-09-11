const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
const sizesReadable = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
const kibiMultiplier = 1024

export function formatBytes (bytes, dm = 2) {
  if (bytes === 0) {
    return '0 ' + sizesReadable[0]
  }
  const i = Math.floor(Math.log(bytes) / Math.log(kibiMultiplier))

  return parseFloat((bytes / Math.pow(kibiMultiplier, i)).toFixed(dm)) + ' ' + sizesReadable[i]
}

export function sizeStrToBytesConvert (value) {
  const number = parseInt(value)
  const numberLength = (number).toString().length
  const size = value.slice(numberLength)

  return sizeConvert(number, size, 'B')
}

export function sizeConvert (value, sourceUnit, destinationUnit) {
  const sourceIndex = (sizes.indexOf(sourceUnit))
  const destinationIndex = (sizes.indexOf(destinationUnit))

  let result = value
  let exponent = 0
  if (sourceIndex > destinationIndex) {
    exponent = sourceIndex - destinationIndex
    result = value * Math.pow(kibiMultiplier, exponent)
    return parseFloat(result)
  } else if (sourceIndex < destinationIndex) {
    exponent = destinationIndex - sourceIndex
    result = value / Math.pow(kibiMultiplier, exponent)
    return parseFloat(result)
  } else {
    return result
  }
}
