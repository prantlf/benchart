const test = require('node:test')
const { strictEqual } = require('assert')
const compareTestNames = require('../lib/compare-test-names')

test('compares two numbers', () => {
  strictEqual(compareTestNames('1.json', '1.json'), 0, '"1" = "1"')
  strictEqual(compareTestNames('1.json', '2.json'), -1, '"1" < "2"')
  strictEqual(compareTestNames('2.json', '1.json'), 1, '"2" > "1"')
})

test('compares two dates', () => {
  strictEqual(compareTestNames('2020-02-18.json', '2020-02-18.json'),
    0, '"2020-02-18" = "2020-02-18"')
  strictEqual(compareTestNames('2020-02-17.json', '2020-02-18.json'),
    -1, '"2020-02-17" < "2020-02-18"')
  strictEqual(compareTestNames('2020-02-18.json', '2020-02-17.json'),
    1, '"2020-02-18" > "2020-02-17"')
})

test('compares a date with a build', () => {
  strictEqual(compareTestNames('2020-02-17.json', '2020-02-18-112.json'),
    -1, '"2020-02-17" < "2020-02-18-112"')
  strictEqual(compareTestNames('2020-02-18-112.json', '2020-02-17.json'),
    1, '"2020-02-18-112" > "2020-02-17"')
  strictEqual(compareTestNames('2020-02-17-112.json', '2020-02-18.json'),
    -1, '"2020-02-17-112" < "2020-02-18"')
  strictEqual(compareTestNames('2020-02-18.json', '2020-02-17-112.json'),
    1, '"2020-02-18" > "2020-02-17-112"')
  strictEqual(compareTestNames('2020-02-18.json', '2020-02-18-112.json'),
    -1, '"2020-02-18" > "2020-02-19-112"')
  strictEqual(compareTestNames('2020-02-18-112.json', '2020-02-18.json'),
    1, '"2020-02-18-112" < "2020-02-18"')
})

test('compares a date with a text', () => {
  strictEqual(compareTestNames('2020-02-17.json', 'local.json'),
    -1, '"2020-02-17" < "local"')
  strictEqual(compareTestNames('local.json', '2020-02-17.json'),
    1, '"local" > "2020-02-17"')
})

test('compares texts', () => {
  strictEqual(compareTestNames('local.json', 'local.json'),
    0, '"local" = "local"')
  strictEqual(compareTestNames('global.json', 'local.json'),
    -1, '"global" < "local"')
  strictEqual(compareTestNames('local.json', 'global.json'),
    1, '"local" > "global"')
})
