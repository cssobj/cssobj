// test with object update

var result = cssobj({
  body:{
    position:'relative',
    color:'red',
    span:{
      color:'blue'
    },
    div:{
      $id:'div',
      fontSize:'12px'
    }
  }
})

var div = result.ref.div.obj

// change value
div.fontSize = '14px'

// add prop
div.color = 'red'

// add node
div.p = {
  lineHeight: 1.5
}

// delete prop
delete result.obj.body.color

// delete node
delete result.obj.body.span

result.update()

log(css(result), 'file:./simple-update.css')

