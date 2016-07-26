var result = cssobj({
  body:{
    color:'red',
    div:{
      fontSize:'12px'
    }
  }
})

log(css(result), './simple-selector-nest.css')

