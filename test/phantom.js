// phantom script for cssobj testing

var webPage = require('webpage')
var page = webPage.create()
var system = require('system');

page.onConsoleMessage = function (msg) {
  system.stdout.write(msg)
}

page.open('test.html', function (status) {

  page.evaluate(function() {

    window.getCSSText = function getCSSText (dom) {
      if(!dom) return ''
      var sheet = dom.sheet || dom.styleSheet
      if(sheet.cssText) return sheet.cssText
      var str = ''
      var rules = sheet.cssRules || sheet.rules
      for(var i = 1, len = rules.length; i < len; i++) {
        str += rules[i].cssText + '\n'
      }
      return str
    }

  })

  page.includeJs(system.args[1], function() {
    page.evaluate(function() {
      console.log(getCSSText(result.cssdom))
    })
    phantom.exit()
  })

})
