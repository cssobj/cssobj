var result = cssobj({'p':{
  'display':function() {
    return [{display:['-webkit-box', '-moz-box']}, 'flex', {flexWrap: 'wrap'}]
  }
}})

log(css(result), 'p { display: -webkit-box; -webkit-flex-wrap: wrap; }\n')
