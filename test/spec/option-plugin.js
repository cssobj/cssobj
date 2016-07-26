// test for using with exists plugin

var result = cssobj({
  body:{
    color:'333',
  }
}, {plugins:{
  post:function(ret){
    ret.suffix = '_test123'
    return ret
  },
  value: function(val, key) {
    return '#'+val
  }
}})

log(css(result)+result.suffix, 'body { color: rgb(51, 51, 51); }\n_test123')

