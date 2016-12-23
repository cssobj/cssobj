// apply ruler style
var pagecss = cssobj(
  {
    'body,html':{
      height:'100%',
      padding:0,
      margin:0,
      overflow:'hidden'
    },
    body:{
      fontSize:16,
      paddingTop:10,
      fontFamily:'Arial, Helvetica'
    },
    '.text':{
      $id: 'con',
      float:'left',
      display:'inline',
      overflow:'hidden',
      width:'99%',
      height:function(){return winHeight && winHeight - document.getElementsByTagName('h3')[0].offsetHeight - 60}
    },
    textarea:{
      width:'100%',
      height:function(v) {
        return v.result.ref.con.lastVal.height
      },
      padding:2,
      border:'1px solid black'
    },
    '.csstext':{
      display: 'none'
    },
    '@media (min-width:350px)': {
      '.text':{
        width: function() {
          return winWidth && winWidth/2 - 4 + 'px'
        }
      },
      '.csstext':{
        display: 'block'
      }
    },
    '#hr':{
      paddingTop:20,
      borderTop:'1px dashed black'
    },
    '#size': {
      textAlign: 'center',
      width: 150,
      position: 'absolute',
      background: 'yellow',
      top: 0,
      left: function(v) {
        return winWidth && winWidth/2 - this.width/2
      }
    }
  },
  {
    local: false,
    cssom:{name:'_indexpage'},
    plugins: [cssobj_plugin_default_unit()]
  }
)

var winWidth, winHeight
window.onresize = function() {
  winWidth = document.documentElement.offsetWidth
  winHeight = document.documentElement.offsetHeight
  document.getElementById('size').innerHTML = 'window width: '+winWidth
  pagecss.update()
  updateCSSText()
}

function getCSSText(dom) {
  var sheet = dom.sheet || dom.styleSheet
  if(sheet.cssText) return sheet.cssText
    .replace(/^\s*html\s*{\s*}\s*/i, '')
    .replace(/^\s*body\s*{\s*}\s*/i, '')

  var str = ''
  var rules = sheet.cssRules || sheet.rules
  for(var i = 0, len = rules.length; i < len; i++) {
    str += rules[i].cssText + '\n'
  }
  return str
}
