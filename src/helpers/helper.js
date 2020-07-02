if (global.document) {
  global.window = window;
  global.$ = require('jquery');
  module.exports = window.document;
} else {
  const {JSDOM} = require('jsdom');
  const {window} = new JSDOM();
  module.exports = window.document;
}