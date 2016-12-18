# Function as CSS Value

In cssobj, if value type is **function**, then the function will be evaluated with signature:

```Javascript
function(prev, node, result){} -> string|number|object
```

 1. If the function return `string|number`, then the prop will update to that

 2. If the function return `object`, then the object will be merged into current style rule

## Example

Below, when user click, `div` will get random `color`

```Javascript

result = cssobj({ div:{ color: 'red' } })

element.onclick = function(){

  result.obj.div.color = function() {
    return randomColor()  //return a string
  }
  result.update()

}

```

Below, when user click, `div` will get random `color`, and also a random `font-size`

```Javascript

result = cssobj({ div:{ color: 'red' } })

element.onclick = function(){

  result.obj.div.color = function() {
    return { color: randomColor(), fontSize: randomSize() + 'px' }  //return a object
  }
  result.update()

}

```

You can see more examples in [test cases](https://github.com/cssobj/cssobj-core/blob/91f508f2657db2cc3b6762db34cf2b2472bb4330/test/test.js#L1303)

## Function execute order

Think there's many function as value in your source object, cssobj can control the function order by adding **$order** directive

If we have below layout:

```html
<div class="box1"></div>
<div class="box2"></div>
<div class="box3"></div>
```

The layout requirement:

- box1 will have same width & height

- box2's height is sum of box1 & 3

- box3's height is twice of box1


```Javascript
obj = {
  '.box1':{
    $id:'box1',
    width:10,
    height: function(prev,node,result) {
      return node.rawVal.width
    }
  },
  '.box2':{
    height: function(prev,node,result) {
      return result.ref.box1.rawVal.height + result.ref.box3.rawVal.height
    }
  },
  '.box3':{
    $id:'box3',
    height: function(prev,node,result) {
      return result.ref.box1.rawVal.width*2
    }
  }
}

cssobj(obj, {plugins: [defaultUnit('px')] })
```

Above, `prev` is the previous CSS value, after `defaultUnit` plugin, so it have `px` appended, `string` type

`rawVal` is the value before `defaultUnit` plugin, so it will always keep as `number` type, ready for calculate

But, the problem is, the default function invoke order is **from top to bottom**

The execution order is `box1 -> box2 -> box3`, that way the result is wrong

You can add **$order** directive (default value is **0**), to change there execution order

```Javascript
{
  '.box1':{
    $id:'box1',  // default $order === 0
    width:10,
    height: function(prev,node,result) {
      return node.rawVal.width
    }
  },
  '.box2':{
    $order:2,
    height: function(prev,node,result) {
      return result.ref.box1.rawVal.height + result.ref.box3.rawVal.height
    }
  },
  '.box3':{
    $id:'box3',
    $order:1,
    height: function(prev,node,result) {
      return result.ref.box1.rawVal.width*2
    }
  }
}
```

Above, the execute order is `box1 ($order:0) -> box3 ($order:1) -> box2 ($order:2)`

This time it's worked right

