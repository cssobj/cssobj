var result = cssobj({'div,table':{
  'fontSize':'12px',
  'p,span':{
    color:'red'
  }
}})

log(css(result), 'file:./comma-in-selector.css')
