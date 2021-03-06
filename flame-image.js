var fs = require('fs')
var spawn = require('child_process').spawn
var which = require('which')
var debug = require('debug')('0x:flame-image')

module.exports = function (svg, opts, next, done) {
  debug('checking for convert binary')
  which('convert', function (err, path) {
    if (err) {
      debug('imagemagick is not installed')
      next()
      done()
      return
    }

    var dir = opts.dir || '.'
    debug('writing svg')
    fs.writeFileSync(dir + '/flamegraph.svg', svg)
    var background = 'black'
    var args = ['-background', background, '-trim', '-resize',
      'x460', dir + '/flamegraph.svg', dir + '/flamegraph-small.png']

    spawn('convert', args)
      .on('close', function () {
        next()
        spawn('bash', [__dirname + '/imgcat', dir + '/flamegraph-small.png'], {stdio: 'inherit'})
          .on('exit', function (code) {
            done()
          })
      })
  })
}
