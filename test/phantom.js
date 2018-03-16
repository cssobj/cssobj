// phantom script for cssobj testing

var webPage = require('webpage')
var page = webPage.create()
var system = require('system')

page.onConsoleMessage = function (msg) {
  system.stdout.write(msg)
}


// page.onResourceError = function(resourceError) {
//   console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
//   console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
// };
// page.onResourceReceived = function(response) {
//   console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
// };

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }
  console.error(msgStack.join('\n'));
}

page.open('test.html', function (status) {
  page.includeJs(system.args[1], function() {
    setTimeout(function() {
      phantom.exit()
    })
  })

})
