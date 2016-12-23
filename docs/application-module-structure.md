# Application Module Structure

When working with cssobj, there's some best practice of module structure, like below module structure:

    base_style_module -> style_factory_module -> application_module

For example, you have an photo application, that user can choose layout of their photoes.

> code of base_style_module

```Javascript
// FILE: base-style.js

// option (opt): per rule based
// state:        per stylesheet (result) based

// state can be mobile, or pc
export const float = opt => ({
  .img { width: opt.width + 'px', float:'left', padding: v => v.result.state.platform == 'mobile' ? '0px' : '30px' }
})

export const flex = opt => ({
  .img { width: opt.width + 'px', flex: 1}
})
```

> code of style_factory_module

```Javascript
// FILE: style-factory.js
import cssobj from 'cssobj'
import { getState } from './state-manager'
import * as css from './base-style'

// create empty <style> container
export const pageStyle = cssobj({}, {local:true}, getState() )

// can change from float layout into flex layout
// return cssobj result
export function changeLayout (type, opt, state) {
  return pageStyle.update( css[type](opt), state )
}
```

> code of application_module

```Javascript
import {changeLayout} from './style-factory'

element.onclick = e => {
  changeLayout('flex', {width: 100}, {platform: 'pc'})
}
```

Above, just a basic template, more work should be done in real world

Some other pattern, contribution is welcome

