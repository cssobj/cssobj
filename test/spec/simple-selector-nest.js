var result = cssobj({
  body:{
    color:'red',
    div:{
      fontSize:'12px'
    }
  }
})

log(css(result), 'file:./simple-selector-nest.css')
