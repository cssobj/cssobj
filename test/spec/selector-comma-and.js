var result = cssobj({div:{
  'fontSize':'12px',
  '&:before, &:after':{
    'content':'"---"'
  }
}})

log(css(result), 'file:./selector-comma-and.css')

