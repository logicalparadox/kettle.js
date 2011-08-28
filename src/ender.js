!function ($) {
  var kettle = require('kettle');
  $.ender({
    kettle: function () {
      return kettle(this);
    }
  }, true);
}(ender);