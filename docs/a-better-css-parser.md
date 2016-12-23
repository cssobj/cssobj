# A Better CSS in JS

Parse CSS Selector in JS is not easy, think below problems:


### Should avoid using **Unicode Unsafe RegExp**

  CSS Selector can contain most of the unicode, so
  [Some Test](https://mathiasbynens.be/notes/es6-unicode-regex) may failed, example:

  ```Javascript
  const selector = '.a𝌆b';

  console.log(/a.b/.test(selector));
  // → false ???
  ```
  This should be solved using ES6 RegExp unicode `/u` flag, or polyfill, but that add amount of code size.

  Better way is to avoid using RegExp to parse CSS, that is the safe way.

### Should split `,` (comma) right

  ```Javascript
  { 'div, p[title="you,me"]': { color: 'red' } }
  ```

  When parse the selector, cannot simply `selector.split(',')`, it's doing wrong, even [Stylus](http://stylus-lang.com/try.html#?code=div%2C%20p%5Btitle%3D%22you%2Cme%22%5D%20%7B%0A%20%20%20%20color%3A%20red%3B%0A%20%20%7D) cannot pass the above test.

  The right way is using a [small parser](https://github.com/cssobj/cssobj-helper/blob/445712ec1d5ad63b0572dc89c013605d8e93f433/dist/cssobj-helper.amd.js#L96), to filter special cases.

### Should replace `&` char right

  Below object is for nested selector (`&` == parent selector) :

  ```Javascript
  {
    'p': {
      '&.a[title="you & me"]' : { color: 'red' }
    }
  }
  ```

  A css-in-js lib **should not** simplely replace the `&` char, should carefully test every corner case.

  cssobj won't touch `&` within string, `[]` and `()`.

### Should keep original class names

  When CSS Author write his class names, a lib should not replace it with other when localizing:

  ```Javascript
  {
    '.item': {
      color: 'red'
    }
  }
  ```

  Instead, all the selector names from CSS Author (`.item` part) should be keeped, that way user can debug easily, and may be referenced in other lib easily.

  Some lib using **hash**, or Random ID, the original CSS Author will lost his way.


