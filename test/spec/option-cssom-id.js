// test name, attrs, reset

var result = cssobj(
  {
    body: {
      color: 'red'
    }
  },
  {
    cssom: {
      id: 'test-name',
      attrs: {
        type: 'text/css'
      }
    }
  }
)

log(result.cssdom.id, 'test-name')
log(result.cssdom.type, 'text/css')
log(css(result), 'body { color: red; }\n')

// same name should combine all css when append=true
// result.cssom keep the same object (will not delete)
cssobj({p: {color: 'blue'}}, {cssom: {id: 'test-name', append: true}})
log(result.cssdom.type, 'text/css')
log(css(result), 'body { color: red; }\np { color: blue; }\n')

// append=false will recreate style tag
// result.cssom lost!!
result = cssobj({p: {color: 'blue'}}, {cssom: {id: 'test-name'}})
log(result.cssdom.type, '')
log(css(result), 'p { color: blue; }\n')


