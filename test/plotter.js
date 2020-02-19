/* global it */

const plot = require('../lib/plotter')
const { join } = require('path')
const { lstat, remove } = require('fs-extra')

function addTest (description, test) {
  if (typeof describe === 'function') {
    it(description, test)
  } else {
    exports[`test runner: ${description}`] = test
  }
}

async function checkFile (path) {
  const stats = await lstat(path)
  if (!stats.isFile()) {
    throw new Error(`No file found at "${path}".`)
  }
}

addTest('is the main export', assert => {
  const plot2 = require('..')
  assert.equal(plot, plot2, 'Exported functions are the same')
})

addTest('exports itself and the Plotter class as named exports', assert => {
  const { plot: plot2, Plotter } = require('..')
  assert.equal(typeof plot2, 'function', 'The plotter function is exported.')
  assert.equal(plot, plot2, 'Exported functions are the same')
  assert.equal(typeof Plotter, 'function', 'The Plotter class is exported.')
})

addTest('plots a timeline', async assert => {
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
    .catch(error => assert.fail(error))
})

addTest('plots a comparison', async assert => {
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
    .catch(error => assert.fail(error))
})

if (require.main === module) {
  require('test')
    .run(exports)
}
