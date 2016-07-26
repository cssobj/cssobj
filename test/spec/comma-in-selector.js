var result = cssobj({'div,table':{
  'fontSize':'12px',
  'p,span':{
    color:'red'
  }
}})

log(css(result), './comma-in-selector.css')
