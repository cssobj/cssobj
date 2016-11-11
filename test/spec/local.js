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

log(result.options.local.prefix, 'regexp:^\\w+$')
log(css(result), 'regexp:^._\\w+_nav { color: red; }\\n$')

// define prefix
var result = cssobj({
  '.nav':{
    color:'red',
  },
  ':global(.iconfont).edit': {
    color:'blue'
  },
  '.iconfont.!edit': {
    color:'blue'
  },
}, {local:{prefix:'_abc_'}})

log(css(result), '._abc_nav { color: red; }\n.iconfont._abc_edit { color: blue; }\n._abc_iconfont.edit { color: blue; }\n')
log(result.mapClass(':global(.abc .def) xyz'), ' abc def _abc_xyz')

// test for mapSel
log(result.mapSel('.nav'), '._abc_nav')
log(result.mapSel(':global(.abc .def) xyz'), '.abc .def xyz')
log(result.mapSel('.nav a[title=".sdf].abc:global(.def)"]'), '._abc_nav a[title=".sdf].abc:global(.def)"]')
log(result.mapSel('.nav.选择器1.!选择器2'), '._abc_nav._abc_选择器1.选择器2')

// localNames
var result = cssobj({
  '.nav':{
    color:'red',
  }
}, {local:{prefix:'_abc_', localNames:{nav:'cde'}}})

log(css(result), '.cde { color: red; }\n')

// test for mapSel
log(result.mapSel('.nav .xyz'), '.cde ._abc_xyz')
