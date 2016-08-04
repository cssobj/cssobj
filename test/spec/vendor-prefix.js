var obj = {
  '@keyframes anim1':{
    '0%': { left: '0' },
    '100%': { left: '200px' }
  },
  body:{
    animationName: 'anim1',
    color:'red',
    textEmphasisStyle:'dot', imeAlign:'auto',
    input:{
      float: 'left',
      fontSize:'12px',
      appearance: 'none'
    }
  }
}

var result = cssobj(obj)

log(
  css(result),
  '@-webkit-keyframes anim1 { \n  0% { left: 0px; }\n  100% { left: 200px; }\n}\n\
body { -webkit-animation: anim1; color: red; -webkit-text-emphasis-style: dot; }\n\
body input { float: left; font-size: 12px; -webkit-appearance: none; }\n'
   )

obj.body.input.appearance = 'inherit'
result.update()


log(
  css(result),
  '@-webkit-keyframes anim1 { \n  0% { left: 0px; }\n  100% { left: 200px; }\n}\n\
body { -webkit-animation: anim1; color: red; -webkit-text-emphasis-style: dot; }\n\
body input { float: left; font-size: 12px; -webkit-appearance: inherit; }\n'
   )
