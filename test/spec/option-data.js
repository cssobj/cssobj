var result = cssobj({
  body:{
    color:'red',
  }
}, null, 'custom data here')

log(result.state, 'custom data here')
var prevID = result.cssdom.id

result.obj.body.fontSize = '12px'
result.update()
log(result.state, 'custom data here')
// should keep same ID
log(result.cssdom.id, prevID)
log(css(result), 'body { color: red; font-size: 12px; }\n')

result.update({p: {color: 'red'}}, 'another state')
// should keep same ID
log(result.cssdom.id, prevID)
log(result.state, 'another state')
log(css(result), 'p { color: red; }\n')


// should accept function as object
result.update(function() {
  return {p: {color: 'red'}}
})
// should keep same ID
log(css(result), 'p { color: red; }\n')
