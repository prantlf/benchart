const test = require('node:test')
const { fail, strictEqual } = require('assert')
const plot = require('../lib/plotter')
const { join } = require('path')
const { lstat, remove } = require('fs-extra')

async function checkFile (path) {
  const stats = await lstat(path)
  if (!stats.isFile()) {
    throw new Error(`No file found at "${path}".`)
  }
}

test('is the main export', () => {
  const plot2 = require('..')
  strictEqual(plot, plot2, 'Exported functions are the same')
})

test('exports itself and the Plotter class as named exports', () => {
  const { plot: plot2, Plotter } = require('..')
  strictEqual(typeof plot2, 'function', 'The plotter function is exported.')
  strictEqual(plot, plot2, 'Exported functions are the same')
  strictEqual(typeof Plotter, 'function', 'The Plotter class is exported.')
})

test('plots a timeline', async () => {
  await remove(join(__dirname, 'output/timeline.dat'))
  await remove(join(__dirname, 'output/timeline.plt'))
  await remove(join(__dirname, 'output/timeline.png'))
  return plot({
    title: 'Timeline',
    directory: __dirname,
    outDirectory: join(__dirname, 'output'),
    height: 300,
    yMax: 0.00000006,
    yProperty: 'mean',
    outName: 'timeline',
    verbose: true
  })
    .then(async () => {
      await checkFile(join(__dirname, 'output/timeline.dat'))
      await checkFile(join(__dirname, 'output/timeline.plt'))
      await checkFile(join(__dirname, 'output/timeline.png'))
    })
    .catch(error => fail(error))
})

test('plots a comparison', async () => {
  await remove(join(__dirname, 'output/comparison.dat'))
  await remove(join(__dirname, 'output/comparison.plt'))
  await remove(join(__dirname, 'output/comparison.png'))
  return plot({
    title: 'Comparison',
    directory: __dirname,
    outDirectory: join(__dirname, 'output'),
    type: 'comparison',
    errorBars: true,
    outName: 'comparison'
  })
    .then(async () => {
      await checkFile(join(__dirname, 'output/comparison.dat'))
      await checkFile(join(__dirname, 'output/comparison.plt'))
      await checkFile(join(__dirname, 'output/comparison.png'))
    })
    .catch(error => fail(error))
})
