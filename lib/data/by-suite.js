const { readJson } = require('fs-extra')
const { basename } = require('path')
const { getProperty } = require('./common')

async function generateDataClusteredBySuite (files, yProperty, errorBars) {
  let data = ''
  for (const file of files) {
    const [firstSuite] = await readJson(`${file}`)
    const fileName = basename(file).replace('.json', '')
    data += `"${fileName}"`
    for (const benchmark of firstSuite.benchmarks) {
      const value = getProperty(benchmark, yProperty)
      data += ` ${value}`
      if (errorBars) {
        const rme = getProperty(benchmark, 'rme')
        data += ` ${value * rme / 100}`
      }
    }
    data += '\n'
  }
  return data
}

module.exports = generateDataClusteredBySuite
