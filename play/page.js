// apply ruler style
var pagecss = cssobj({
  'body,html':{height:'100%', padding:0, margin:0, overflow:'hidden'},
  body:{paddingTop:10,fontFamily:'Arial, Helvetica'},
  textarea:{width:'99%', border:'1px solid black', height:function(){return winHeight - document.getElementsByTagName('h3')[0].offsetHeight - 30}},
  '#hr':{paddingTop:10, borderTop:'1px solid black'},
  '#size': {
  textAlign: 'center',
  width: 150,
  position: 'absolute',
  background: 'yellow',
  top: 0,
  left: function(val,node) {
    return winWidth/2 - node.lastVal.width/2
  }
}}, {plugins: {value: cssobj_plugin_value_default_unit()}})

var winWidth, winHeight
window.onresize = function() {
  winWidth = document.documentElement.offsetWidth
  winHeight = document.documentElement.offsetHeight
  document.getElementById('size').innerHTML = 'window width: '+winWidth
  pagecss.update()
}
