var expect = require('chai').expect
var spawn = require('child_process').spawn
var diff = require('diff')
var fs = require('fs')
var path = require('path')
var walk = require('walk')

function formatResult (str) {
  return str.replace(/\n/g, '\\n').replace(/\s+$/, '[ ]')
}

function runPhantom (testFile, targetFile, done) {
  var cliProcess = spawn('phantomjs', ['phantom.js'].concat([testFile]))

  var output = '', msg = ''
  cliProcess.stdout.on('data', function (data) {
    output += data
  })
  cliProcess.stderr.on('data', function (data) {
    msg += data
  })
  cliProcess.on('exit', function () {
    if (msg) return done(msg)
    console.log(output)

    try {
      var target = fs.readFileSync(targetFile, 'utf8')
    } catch(e) {
      return done(e)
    }

    var result = '', line = 0
    diff.diffLines(output, target).forEach(function (part) {
      if (part.added) result += '[target added] below line ' + line + ':\n' + formatResult(part.value) + '\n'
      if (part.removed) result += '[target removed] below line ' + line + ':\n' + formatResult(part.value) + '\n'
      line += part.count
    })

    done(result)
  })
}

var walker = walk.walkSync('./spec', {
  followLinks: false,
  listeners:{
    file : walkFile
  }
})

function walkFile(root, stat, next) {

  if(/\.css$/i.test(stat.name)) return next()

  describe('test case in '+root, function () {

    var testFile = path.join(root, stat.name)
    var targetFile = testFile.replace(/\.js$/i, '.css')

    it('case file '+stat.name, function (done) {
      runPhantom(testFile, targetFile, done)
    })

  })
  next()

}
