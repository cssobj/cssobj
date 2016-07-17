// rollup.config.js

export default {
  entry: 'lib/cssobj.js',
  moduleName: 'cssobj',
  moduleId: 'cssobj',
  targets: [
    { format: 'iife', dest: 'dist/cssobj.iife.js' },
    { format: 'amd',  dest: 'dist/cssobj.amd.js'  },
    { format: 'cjs',  dest: 'dist/cssobj.cjs.js'  },
    { format: 'es',   dest: 'dist/cssobj.es.js'   }
  ]
}
