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

log(result.config.local.space, 'regexp:^\\w+$')
log(css(result), 'regexp:^.nav_\\w+_ { color: red; }\\n$')

// define space
var result = cssobj({
  '.nav':{
    color:'red',
  },
  '.!iconfont.edit': {
    color:'blue'
  },
  '.iconfont.!edit': {
    color:'blue'
  },
}, {local:{space:'_abc_'}})

log(css(result), '.nav_abc_ { color: red; }\n.iconfont.edit_abc_ { color: blue; }\n.iconfont_abc_.edit { color: blue; }\n')
log(result.mapClass('.!abc .!def xyz'), ' abc def xyz_abc_')

// test for mapSel
log(result.mapSel('.nav'), '.nav_abc_')
log(result.mapSel('.!abc .!def xyz'), '.abc .def xyz')
log(result.mapSel('.nav a[title=".sdf].abc.!def"]'), '.nav_abc_ a[title=".sdf].abc.!def"]')
log(result.mapSel('.nav.选择器1.!选择器2'), '.nav_abc_.选择器1_abc_.选择器2')

// localNames
var result = cssobj({
  '.nav':{
    color:'red',
  }
}, {local:{space:'_abc_', localNames:{nav:'cde'}}})

log(css(result), '.cde { color: red; }\n')

// test for mapSel
log(result.mapSel('.nav .xyz'), '.cde .xyz_abc_')
