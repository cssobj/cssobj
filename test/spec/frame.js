var iframe = document.createElement('iframe')
document.body.appendChild(iframe)

iframe.onload = function() {
  // only apply cssobj when onload
  var result = cssobj({
    p:{color:'red'}
  }, {cssom: {frame: document.getElementById('frame')}})

  log(css(result), 'p { color: red; }\n')

  //update test
  result.obj.p.fontSize = '12px'
  result.update()

  log(css(result), 'p { color: red; font-size: 12px; }\n')
}

iframe.src = 'iframe.html'
