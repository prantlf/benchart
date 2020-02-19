function compareTestNames (left, right) {
  left = separateByNumbers(left.replace('.json', ''))
  right = separateByNumbers(right.replace('.json', ''))
  const leftLength = left.length
  const rightLength = right.length
  for (let i = 0; i < leftLength; ++i) {
    if (i >= rightLength) {
      return 1
    }
    const leftPart = left[i]
    const rightPart = right[i]
    if ((typeof leftPart === 'number') !== (typeof rightPart === 'number')) {
      if (typeof leftPart === 'number') {
        return -1
      }
      if (typeof rightPart === 'number') {
        return 1
      }
    }
    if (leftPart < rightPart) {
      return -1
    }
    if (leftPart > rightPart) {
      return 1
    }
  }
  return leftLength < rightLength ? -1 : 0
}

function separateByNumbers (string) {
  const parts = []
  const numbers = /\d+/g
  let start = 0
  let match
  while ((match = numbers.exec(string)) !== null) {
    const index = match.index
    if (index > 0) {
      parts.push(string.substring(start, index))
    }
    const number = match[0]
    parts.push(+number)
    start = index + number.length
  }
  if (start < string.length) {
    parts.push(string.substring(start))
  }
  return parts
}

module.exports = compareTestNames
