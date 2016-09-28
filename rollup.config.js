// rollup.config.js
import { readFileSync } from 'fs'
import replace from 'rollup-plugin-replace'

var pkg = JSON.parse(readFileSync('package.json', 'utf-8'))

var lib = 'lib/cssobj.js'

var commitHash = (function () {
  try {
    return readFileSync('.commithash', 'utf-8')
  } catch (err ) {
    return 'unknown'
  }
})()

var banner = readFileSync('lib/banner.js', 'utf-8')
  .replace('${version}', pkg.version)
  .replace('${time}', new Date())
  .replace('${commit}', commitHash)

export default {
  entry: lib,
  moduleName: 'cssobj',
  moduleId: 'cssobj',
  plugins: [
    replace({
      include: lib,
      delimiters: [ '<@', '@>' ],
      sourceMap: true,
      values: { 'VERSION': pkg.version }
    })
  ],
  banner: banner,
  targets: [
    { format: 'iife', dest: 'dist/cssobj.iife.js' },
    { format: 'amd',  dest: 'dist/cssobj.amd.js'  },
    { format: 'cjs',  dest: 'dist/cssobj.cjs.js'  },
    { format: 'es',   dest: 'dist/cssobj.es.js'   }
  ]
}
