var expect = require('chai').expect
var spawn = require('child_process').spawn
var diff = require('diff')
var fs = require('fs')
var path = require('path')
var walk = require('walk')

function formatResult (str) {
  return str.replace(/\n/g, '\\n').replace(/\s+$/, '[ ]')
}

function runPhantom (root, fileName, done) {

  var testFile = path.join(root, fileName)

  var cliProcess = spawn('phantomjs', ['phantom.js'].concat([testFile]), {cwd: __dirname})

  var output = '', msg = ''
  cliProcess.stdout.on('data', function (data) {
    output += data
  })
  cliProcess.stderr.on('data', function (data) {
    msg += data
  })
  cliProcess.on('exit', function () {
    if (msg) return done(msg)
    // console.log(output)

    // test format is output******result.css
    var group = output.replace(/------$/,'').split('------')

    for(var i = 0, len = group.length; i < len; i++) {
      var text = group[i].split('******')
      if(text.length<2) return done('wrong test format')

      try {
        var target = fs.readFileSync(path.join(root, text[1]), 'utf8')
      } catch(e) {
        return done(e)
      }

      var result = '', line = 0
      diff.diffLines(text[0], target).forEach(function (part) {
        if (part.added) result += '[target added] below line ' + line + ':\n' + formatResult(part.value) + '\n'
        if (part.removed) result += '[target removed] below line ' + line + ':\n' + formatResult(part.value) + '\n'
        line += part.count
      })
      if(result) return done(text[1] + ':' + result)

    }

    done()
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

    this.slow(3000)

    it('case file '+stat.name, function (done) {
      runPhantom(root, stat.name, done)
    })

  })
  next()

}
