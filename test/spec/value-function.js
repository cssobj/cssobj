var colors = {
  black: 'red',
  red: 'black'
}

var result = cssobj({'p':{
  color: function(v) {
    return v.cooked ? colors[v.cooked] : 'black'
  },
  'display':function() {
    return [{display:['-webkit-box', '-moz-box']}, 'flex', {flexWrap: 'wrap'}]
  }
}})

log(css(result), 'p { color: black; display: -webkit-box; -webkit-flex-wrap: wrap; }\n')

result.update()
log(css(result), 'p { color: red; display: -webkit-box; -webkit-flex-wrap: wrap; }\n')
