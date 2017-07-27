
var result = cssobj({
  h3: {
    color: 'red',
  },
  '@media (min-width: 400px)': {
    h3: {
      color: 'blue',
    },
  }
}, {cssom: {media: '.'}})

log(css(result), 'file:./nomedia.css')

var ok = false
var callCount = 0
var result = cssobj({
  h3: {
    color: 'red',
  },
  '@media print': {
    $groupTest: function(){
      callCount++
      return ok
    },
    h3: {
      color: 'orange',
    },
  }
}, {cssom: {}})

log(css(result), 'file:./media-test.css')

ok=true
result.update()
log(css(result), 'file:./media-test2.css')

ok=false
result.update()
log(css(result), 'file:./media-test.css')



var result = cssobj({
  h3: {
    color: 'red',
  },
  '@media print': {
    h3: {
      color: 'orange',
    },
  }
}, {cssom: {media: 'print'}})

log(css(result), 'file:./media-print.css')

// all media
result.config.cssom.media = null
result.update()
log(css(result), 'file:./media-print2.css')

// only root media
result.config.cssom.media = ''
result.update()
log(css(result), 'file:./media-print2.css')

// only root media
result.config.cssom.media = 'print'
result.update()
log(css(result), 'file:./media-print.css')



