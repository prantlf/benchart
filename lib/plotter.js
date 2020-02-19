const { outputFile } = require('fs-extra')
const { join } = require('path')
const { promisify } = require('util')
const execa = require('execa')
const glob = require('glob')
const globAsync = promisify(glob)
const compareTestNames = require('./compare-test-names')

class Plotter {
  constructor ({ outDirectory, outName, verbose }) {
    this.outDirectory = outDirectory || '.'
    this.outName = outName || 'chart'
    this.verbose = verbose
  }

  async collectFiles (directory) {
    log(this, `Collecting JSON files in "${directory}"`)
    const files = await globAsync('*.json', { cwd: directory })
    log(this, `Found ${files.length} file${files.length !== 1 ? 's' : ''}.`)
    return files
      .sort(compareTestNames)
      .map(file => `${directory}/${file}`)
  }

  async generateData ({ type, clusterBy, yProperty, errorBars, files }) {
    ({ type, clusterBy, yProperty } = ensureChartDefaults(
      type, clusterBy, yProperty))
    const path = `${join(this.outDirectory, this.outName)}.dat`
    log(this, `Extracting data clustered by "${clusterBy}" to "${path}"`)
    const generator = require(`./data/by-${clusterBy}`)
    const data = await generator(files, yProperty, errorBars)
    await outputFile(path, data)
  }

  async generateChart ({
    type,
    title,
    width,
    height,
    xLabel,
    yLabel,
    clusterBy,
    legendPlace,
    yMin,
    yMax,
    yProperty,
    errorBars,
    files
  }) {
    ({ type, clusterBy, yProperty } = ensureChartDefaults(
      type, clusterBy, yProperty))
    if (xLabel === undefined) {
      xLabel = clusterBy === 'suite' ? 'Suite' : 'Benchmark'
    }
    if (yLabel === undefined) {
      yLabel = yProperty === 'hz' ? 'Ops/sec' : 'Time [s]'
    }
    if (title === undefined) {
      title = 'Benchmark Results'
    }
    if (legendPlace === undefined) {
      legendPlace = 'outside'
    }

    const path = `${join(this.outDirectory, this.outName)}.plt`
    log(this, `Generating a "${type}" chart template to "${path}"`)
    const generator = require(`./charts/${type}`)
    const chart = await generator({
      outName: this.outName,
      title,
      width,
      height,
      xLabel,
      yLabel,
      clusterBy,
      legendPlace,
      yMin,
      yMax,
      errorBars,
      files
    })
    await outputFile(path, chart)
  }

  async plotChart () {
    log(this, `Plotting the chart as PNG to "${this.outDirectory}"`)
    await execa('gnuplot', ['-p', `${this.outName}.plt`], { cwd: this.outDirectory })
  }
}

function ensureChartDefaults (type, clusterBy, yProperty) {
  if (type === undefined) {
    type = 'timeline'
  }
  if (clusterBy === undefined) {
    clusterBy = type === 'timeline' ? 'suite' : 'benchmark'
  }
  if (yProperty === undefined) {
    yProperty = 'hz'
  }
  return { type, clusterBy, yProperty }
}

function log (plotter, message) {
  if (plotter.verbose) {
    console.log(message)
  }
}

async function plot ({
  directory,
  files,
  type,
  title,
  width,
  height,
  xLabel,
  yLabel,
  clusterBy,
  legendPlace,
  yMin,
  yMax,
  yProperty,
  errorBars,
  outDirectory,
  outName,
  verbose
}) {
  if (outDirectory === undefined) {
    outDirectory = directory
  }

  const plotter = new Plotter({ outDirectory, outName, verbose })
  if (files) {
    log(plotter, `Passed ${files.length} file${files.length !== 1 ? 's' : ''}.`)
  } else {
    files = await plotter.collectFiles(directory)
  }
  await plotter.generateData({ type, clusterBy, yProperty, errorBars, files })
  await plotter.generateChart({
    type,
    title,
    width,
    height,
    xLabel,
    yLabel,
    clusterBy,
    yProperty,
    errorBars,
    legendPlace,
    yMin,
    yMax,
    files
  })
  await plotter.plotChart()
}

plot.plot = plot
plot.Plotter = Plotter
module.exports = plot
