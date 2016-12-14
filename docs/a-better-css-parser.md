# A Better CSS in JS

Parse CSS Selector in JS is not easy, think below problems:


### Should avoid using **Unicode Unsafe RegExp**

  CSS Selector can contain most of the unicode, so
  [Some Test](https://mathiasbynens.be/notes/es6-unicode-regex) may failed, example:

  ```Javascript
  const string = 'a𝌆b';

  console.log(/a.b/.test(string));
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

  See below object for nested (`&` == parent selector) :

  ```Javascript
  {
    'p': {
      '&.a[title="you & me"]' : { color: 'red' }
    }
  }
  ```
  
  It's simple, a css-in-js lib should avoid simple replace the `&` char, cssobj using `\\&` to escape.
  
### Should keep original class names

  When author write his class name, a lib should not drop it when localize:

  ```Javascript
  {
    '.item': {
      color: 'red'
    }
  }
  ```

  When a lib render the object, the `.item` name should be keeped, that way user can debug easily, and may be referenced in other lib easily.

