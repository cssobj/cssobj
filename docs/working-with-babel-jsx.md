# Working with babel/jsx

When you use `babel` and `jsx`, you can easily transform your existing code and stylesheet into cssobj localized one.

With the plugin [babel-plugin-transform-cssobj](https://github.com/cssobj/babel-plugin-transform-cssobj)

``` javascript
const style = CSSOBJ`
  .!news{ color: white; }
  .nav{
    color: black;
    .item { color: blue; }
  }
  .active { color: red; }
`

const html = style.mapClass(
    <div className='nav'>
    <p className='!news item active'> </p></div>
)
```

The plugin will transform into below code:

``` javascript
import cssobj from "cssobj";
const style = cssobj({
  '.!news': {
    color: 'white'
  },
  '.nav': {
    color: 'black',
    '.item': {
      color: 'blue'
    }
  },
  '.active': {
    color: 'red'
  }
}, {});

const html = (
    <div className={style.mapClass('nav')}>
    <p className={style.mapClass('!news item active')}> </p></div>
)
```

And the conterpart HTML render result is:

```html
<style>AUTO GENERATED IN YOUR HEAD</style>

<div class="nav_f8w2b7i1_">
  <p class="news item_f8w2b7i1_ active_f8w2b7i1_"></p>
</div>
```

Just a sugar, but more handy.


