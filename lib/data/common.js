function getProperty (benchmark, property) {
  return benchmark[property] || benchmark.stats[property]
}

module.exports = { getProperty }
