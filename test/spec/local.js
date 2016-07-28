var result = cssobj({
  '.nav':{
    color:'red',
    '.head &':{
      fontSize:'12px'
    }
  }
})

log(css(result), 'file:./local.css')

// local false
var result = cssobj({
  '.nav':{
    color:'red',
    '.head &':{
      fontSize:'12px'
    }
  }
}, {local:false})

log(css(result), 'file:./local.css')

// local true
var result = cssobj({
  '.nav':{
    color:'red',
  }
}, {local:true})

log(css(result), 'regexp:^._\\w+_nav { color: red; }\\n$')

// define prefix
var result = cssobj({
  '.nav':{
    color:'red',
  }
}, {local:{prefix:'_abc_'}})

log(css(result), '._abc_nav { color: red; }\n')

// localNames
var result = cssobj({
  '.nav':{
    color:'red',
  }
}, {local:{prefix:'_abc_', localNames:{nav:'cde'}}})

log(css(result), '.cde { color: red; }\n')

