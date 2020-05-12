'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/js-reducers.cjs.production.js')
} else {
  module.exports = require('./dist/js-reducers.cjs.development.js')
}
