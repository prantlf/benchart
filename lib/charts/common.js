const legendPlaces = {
  left: 'left',
  right: '',
  outside: 'outside',
  under: 'under'
}

function getYRange (yMin, yMax) {
  if (yMin !== undefined || yMax !== undefined) {
    if (yMin === undefined) {
      yMin = 0
    }
    if (yMax === undefined) {
      yMax = 1
    }
    return `\nset yrange [${yMin}:${yMax}]`
  }
  return ''
}

function getSize (width, height) {
  if (width !== undefined || height !== undefined) {
    if (width === undefined) {
      width = 640
    }
    if (height === undefined) {
      height = 480
    }
    return ` size ${width},${height}`
  }
  return ''
}

module.exports = { legendPlaces, getYRange, getSize }
