const { readJson } = require('fs-extra')
const { getProperty } = require('./common')

async function generateDataClusteredByBenchmark (files, yProperty, errorBars) {
  const suites = []
  for (const file of files) {
    const [firstSuite] = await readJson(`${file}`)
    suites.push(firstSuite)
  }
  let data = ''
  const firstSuite = suites[0]
  const benchmarkCount = firstSuite.benchmarks.length
  const suiteCount = suites.length
  for (let i = 0; i < benchmarkCount; ++i) {
    const { name } = firstSuite.benchmarks[i]
    data += `"${name}"`
    for (let j = 0; j < suiteCount; ++j) {
      const { benchmarks } = suites[j]
      const benchmark = benchmarks[i]
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

module.exports = generateDataClusteredByBenchmark
