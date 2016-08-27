var iframe = document.createElement('iframe')
document.body.appendChild(iframe)

iframe.onload = function() {
  // only apply cssobj when onload
  var result = cssobj({
    p:{color:'red'}
  }, {cssom: {frame: iframe}})

  log(css(result), 'p { color: red; }\n')

  // check widget DOM color, ensure it's applied
  var widget = iframe.contentDocument.getElementById('widget')
  var computedCSS = iframe.contentWindow.getComputedStyle(widget)
  log(computedCSS.color, 'rgb(255, 0, 0)')

  //update test
  result.obj.p.fontSize = '22px'
  result.update()

  log(css(result), 'p { color: red; font-size: 22px; }\n')

  // check widget DOM color, ensure it's applied
  computedCSS = iframe.contentWindow.getComputedStyle(widget)
  log(computedCSS.color, 'rgb(255, 0, 0)')
  log(computedCSS.fontSize, '22px')

}

iframe.src = 'iframe.html'
