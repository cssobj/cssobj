// phantom script for cssobj testing

var webPage = require('webpage')
var page = webPage.create()
var system = require('system')

page.onConsoleMessage = function (msg) {
  system.stdout.write(msg)
}

page.open('test.html', function (status) {

  page.includeJs(system.args[1], function() {
    setTimeout(function() {
      phantom.exit()
    })
  })

})
