// test with object update

var result = cssobj({
  body:{
    span:{
      color:'blue',
      '@media (min-width: 300px)':{
      }
    }
  },
})

log(css(result), 'body span { color: blue; }\n@media (min-width: 300px) { \n}\n')

var body = result.obj.body

// change value in body, when it's empty
body.fontSize = '14px'
body.span['@media (min-width: 300px)'].color = 'red'

result.update()

// should add omRule when it's empty
log(css(result), 'body span { color: blue; }\n@media (min-width: 300px) { \n  body span { color: red; }\n}\nbody { font-size: 14px; }\n')

