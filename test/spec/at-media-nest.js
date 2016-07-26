
var result = cssobj({
  h3: {
    color: 'red',
    textAlign: 'center',
    lineHeight: 1.5,
    fontSize: '32px',
    margin: 0,
    padding: 0,
    span:{color:'red', fontSize:'22px'}
  },
  '@media (min-width: 400)': {
    '@media (max-width: 500)': {
      h3: {
        color: 'blue',
        fontSize: '24px'
      }
    },
    '@media (min-width: 500)': {
      h3: {
        color: 'green',
        fontSize: '20px'
      }
    }
  }
})

console.log('./at-media-nest.css')

result.obj = {
  h3: {
    color: 'red',
    textAlign: 'center',
    lineHeight: 1.5,
    fontSize: '32px',
    margin: 0,
    padding: 0,
    span:{color:'red', fontSize:'22px'}
  },
  '@media (min-width: 400)': {
    '@media (max-width: 510)': {
      h3: {
        color: 'blue',
        fontSize: '24px'
      }
    },
    '@media (min-width: 520)': {
      h3: {
        color: 'green',
        fontSize: '20px'
      }
    }
  }
}

result.update()

console.log('./at-media-nest-2.css')

