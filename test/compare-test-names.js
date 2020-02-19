/* global it */

const compareTestNames = require('../lib/compare-test-names')

function addTest (description, test) {
  if (typeof describe === 'function') {
    it(description, test)
  } else {
    exports[`test runner: ${description}`] = test
  }
}

addTest('compares two numbers', assert => {
  assert.equal(compareTestNames('1.json', '1.json'), 0, '"1" = "1"')
  assert.equal(compareTestNames('1.json', '2.json'), -1, '"1" < "2"')
  assert.equal(compareTestNames('2.json', '1.json'), 1, '"2" > "1"')
})

addTest('compares two dates', assert => {
  assert.equal(compareTestNames('2020-02-18.json', '2020-02-18.json'),
    0, '"2020-02-18" = "2020-02-18"')
  assert.equal(compareTestNames('2020-02-17.json', '2020-02-18.json'),
    -1, '"2020-02-17" < "2020-02-18"')
  assert.equal(compareTestNames('2020-02-18.json', '2020-02-17.json'),
    1, '"2020-02-18" > "2020-02-17"')
})

addTest('compares a date with a build', assert => {
  assert.equal(compareTestNames('2020-02-17.json', '2020-02-18-112.json'),
    -1, '"2020-02-17" < "2020-02-18-112"')
  assert.equal(compareTestNames('2020-02-18-112.json', '2020-02-17.json'),
    1, '"2020-02-18-112" > "2020-02-17"')
  assert.equal(compareTestNames('2020-02-17-112.json', '2020-02-18.json'),
    -1, '"2020-02-17-112" < "2020-02-18"')
  assert.equal(compareTestNames('2020-02-18.json', '2020-02-17-112.json'),
    1, '"2020-02-18" > "2020-02-17-112"')
  assert.equal(compareTestNames('2020-02-18.json', '2020-02-18-112.json'),
    -1, '"2020-02-18" > "2020-02-19-112"')
  assert.equal(compareTestNames('2020-02-18-112.json', '2020-02-18.json'),
    1, '"2020-02-18-112" < "2020-02-18"')
})

addTest('compares a date with a text', assert => {
  assert.equal(compareTestNames('2020-02-17.json', 'local.json'),
    -1, '"2020-02-17" < "local"')
  assert.equal(compareTestNames('local.json', '2020-02-17.json'),
    1, '"local" > "2020-02-17"')
})

addTest('compares texts', assert => {
  assert.equal(compareTestNames('local.json', 'local.json'),
    0, '"local" = "local"')
  assert.equal(compareTestNames('global.json', 'local.json'),
    -1, '"global" < "local"')
  assert.equal(compareTestNames('local.json', 'global.json'),
    1, '"local" > "global"')
})

if (require.main === module) {
  require('test')
    .run(exports)
}
