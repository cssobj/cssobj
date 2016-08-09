
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
  '@media (min-width: 400px)': {
    '@media (max-width: 500px)': {
      h3: {
        color: 'blue',
        fontSize: '24px'
      }
    },
    '@media (min-width: 500px)': {
      h3: {
        color: 'green',
        fontSize: '20px'
      }
    }
  }
})

log(css(result), 'file:./at-media-nest.css')

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
  '@media (min-width: 400px)': {
    '@media (max-width: 510px)': {
      h3: {
        color: 'blue',
        fontSize: '24px'
      }
    },
    '@media (min-width: 520px)': {
      h3: {
        color: 'green',
        fontSize: '20px'
      }
    }
  }
}

result.update()

log(css(result), 'file:./at-media-nest-2.css')

// deep nested @media
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
  '@media (min-width: 400px)': {
    '@media (max-width: 510px)': {
      h3: {
        color: 'blue',
        fontSize: '24px',
        '@media (min-width: 520px)': {
          h3: {
            color: 'green',
            fontSize: '20px'
          }
        }
      }
    }
  }
}

result.update()

log(css(result), 'file:./at-media-nest-3.css')

