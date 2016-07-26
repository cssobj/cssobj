var result = cssobj({
  "div": {
    "fontSize": "12px",
    "color": "blue"
  },
  "@media (max-width: 800px)": {
    ".active": {
      "color": "purple",
      "div &": {
        "color": "red",
        "@media (min-width: 100px)": {
          "color": "green"
        }
      }
    }
  }
}, {prefix:'_prefix_'})

log(css(result), './selector-nest-and.css')

