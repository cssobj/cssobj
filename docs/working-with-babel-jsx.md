# Working with babel/jsx

When you rely on `babel` and `jsx`, you can easily transform your existing code into cssobj localized one.

With the plugin [babel-plugin-transform-cssobj-jsx](https://github.com/cssobj/babel-plugin-transform-cssobj-jsx)

``` javascript
const style = cssobj(obj)

const html = style.mapClass(
    <div className='nav'>
    <p className='!news item active'> </p></div>
)
```

The plugin will transform into below JSX:

``` javascript
const html = (
    <div className={style.mapClass('nav')}>
    <p className={style.mapClass('!news item active')}> </p></div>
)
```

And the conterpart HTML render result is:

```html
<div class="nav_f8w2b7i1_">
  <p class="news item_f8w2b7i1_ active_f8w2b7i1_"></p>
</div>
```

Just a sugar, but more handy.

