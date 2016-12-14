# Working With Stream

**cssobj** can use with stream libs like [flyd](https://github.com/paldepind/flyd), when stream update, it will auto update CSS.

[DEMO on Jsfiddle](https://jsfiddle.net/futurist/eqrkoz8k/)

``` Javascript
// html: <input><button>

import flyd from 'flyd'
import cssobj form 'cssobj'

const obj=flyd.stream({ p: {color: 'grey'} })
const result = obj.map(cssobj(obj()).update)

button.onclick = _ => obj({
  p: { color: input.value }
})
```

When user click on button, the color value will be applied to CSS, automatically.

Also, you can try `flyd.combine`, `flyd.merge`, `flyd.scan`, any thing javascript can does.



