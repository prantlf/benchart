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
      if (i === 0) {
        chart += ':xtic(1)'
      }
      const fileName = basename(files[i]).replace('.json', '')
      chart += ` w l t "${fileName}" lw 2 lt ${i + 1}`
      if (errorBars) {
        chart += `, "" u ${valueIndex + 2}:${valueIndex + 3}` +
          ` w yerrorb notitle lw 2 lt ${i + 1} pt 1`
      }
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
      if (i === 0) {
        chart += ':xtic(1)'
      }
      chart += ` w l t "${name}" lw 2 lt ${i + 1}`
      if (errorBars) {
        chart += `, "" u ${valueIndex + 2}:${valueIndex + 3}` +
          ` w yerrorb notitle lw 2 lt ${i + 1} pt 1`
      }
      if (++i < benchmarks.length) {
        chart += ', \\'
      }
      chart += '\n'
    }
    return chart
  }
}

async function generateTimelineChart ({
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
    xLabel = 'Version'
  }
  legendPlace = legendPlaces[legendPlace]

  let chart = `set term png${getSize(width, height)}
set output "${outName}.png"

set key reverse Left ${legendPlace}
set xtics rotate by -45
set grid${getYRange(yMin, yMax)}

set title "${title}"
set xlabel "${xLabel}"
set ylabel "${yLabel}"

`
  chart += await generateChartSets[clusterBy](outName, files, errorBars)
  return chart
}

module.exports = generateTimelineChart
