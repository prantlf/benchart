const { readJson } = require('fs-extra')
const { basename } = require('path')
const { legendPlaces, getYRange, getSize } = require('./common')

const generateChartSets = {
  async benchmark (outName, files, errorBars) {
    let chart = ''
    for (let i = 0; i < files.length; ++i) {
      chart += i ? '    ' : 'plot'
      const valueIndex = errorBars ? i * 2 : i
      chart += ` "${outName}.dat" u ${valueIndex + 2}`
      if (errorBars) {
        chart += `:${valueIndex + 3}`
      }
      if (i === 0) {
        chart += ':xtic(1)'
      }
      const fileName = basename(files[i]).replace('.json', '')
      chart += ` t "${fileName}"`
      if (i < files.length - 1) {
        chart += ', \\'
      }
      chart += '\n'
    }
    return chart
  },

  async suite (outName, files, errorBars) {
    const suites = await readJson(`${files[0]}`)
    const benchmarks = suites[0].benchmarks
    let chart = ''
    let i = 0
    for (const { name } of benchmarks) {
      chart += i ? '    ' : 'plot'
      const valueIndex = errorBars ? i * 2 : i
      chart += ` "${outName}.dat" u ${valueIndex + 2}`
      if (errorBars) {
        chart += `:${valueIndex + 3}`
      }
      if (i === 0) {
        chart += ':xtic(1)'
      }
      chart += ` t "${name}"`
      if (++i < benchmarks.length) {
        chart += ', \\'
      }
      chart += '\n'
    }
    return chart
  }
}

async function generateComparisonChart ({
  outName,
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
}) {
  if (xLabel === undefined) {
    xLabel = 'Configuration / Scenario'
  }
  legendPlace = legendPlaces[legendPlace]

  errorBars = errorBars ? ' errorb lw 2' : ''
  let chart = `set term png${getSize(width, height)}
set output "${outName}.png"

set style data histograms
set style histogram cluster${errorBars}
set key reverse Left ${legendPlace}
set style fill solid
set boxwidth 0.8
set xtics rotate by -45
set grid ytics${getYRange(yMin, yMax)}

set title "${title}"
set xlabel "${xLabel}"
set ylabel "${yLabel}"

`
  chart += await generateChartSets[clusterBy](outName, files, errorBars)
  return chart
}

module.exports = generateComparisonChart
