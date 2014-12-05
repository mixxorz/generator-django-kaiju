/* globals $, document */
'use strict';

var app = (function() {
  function _init() {
    $(document).foundation();
  }

  return {
    init: _init
  };
})();

$(document).ready(function() {
  app.init();
});
