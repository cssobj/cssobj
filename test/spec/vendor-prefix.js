var obj = {
  body:{
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
  'body { color: red; -webkit-text-emphasis-style: dot; }\n\
body input { float: left; font-size: 12px; -webkit-appearance: none; }\n'
   )

obj.body.input.appearance = 'inherit'
result.update()


log(
  css(result),
  'body { color: red; -webkit-text-emphasis-style: dot; }\n\
body input { float: left; font-size: 12px; -webkit-appearance: inherit; }\n'
   )
