# Merge multiple objects

Merge multiple object is easy

- If you have all the objects, just

```Javascript
// below will merge objA + objB
const obj = Object.assign( {}, objA, objB )

const result = cssobj(obj) // one <style> have them all
```

- Or using `intros` option

```Javascript
cssobj(objA, {intros: [objB, objC]})
// same as above, `intros` just a sugar
```

See the [clearfix intro](https://github.com/cssobj/cssobj-intro-clearfix) for more info.

- But if you don't know `objB` at first, you can dynamically merge them (*since 1.0.1*)

```Javascript
const objA = { '.nav': {color: 'red'} }
const resultA = cssobj(objA, {local: true})
// resultA.space = _ahmk9c4_

const objB = { '.item': {color: 'blue'} }
const resultB = cssobj(objB, {local: resultA})
// this will make resultB have same space as resultA (_ahmk9c4_)
// above code is same as local:{space: resultA.space, localNames: resultA.localNames}

// result:
// .nav_ahmk9c4_ { color: red; }
// .item_ahmk9c4_ { color: blue; }

// you can merge more...
```

