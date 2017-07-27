// rollup.config.js
import { readFileSync } from 'fs'
import replace from 'rollup-plugin-replace'

var pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
var pkgCore = JSON.parse(readFileSync('../cssobj-core/package.json', 'utf-8'))
var pkgCSSOM = JSON.parse(readFileSync('../cssobj-plugin-cssom/package.json', 'utf-8'))
var pkgLocalize = JSON.parse(readFileSync('../cssobj-plugin-localize/package.json', 'utf-8'))

var lib = 'lib/cssobj.js'

var commitHash = readFileSync('.commithash', 'utf-8').trim()
var commitHashCore = readFileSync('../cssobj-core/.commithash', 'utf-8').trim()
var commitHashCSSOM = readFileSync('../cssobj-plugin-cssom/.commithash', 'utf-8').trim()
var commitHashLocalize = readFileSync('../cssobj-plugin-localize/.commithash', 'utf-8').trim()

var banner = readFileSync('lib/zbanner.js', 'utf-8')
  .replace('${version}', pkg.version)
  .replace('${versionCore}', pkgCore.version)
  .replace('${versionCSSOM}', pkgCSSOM.version)
  .replace('${versionLocalize}', pkgLocalize.version)
  .replace('${time}', new Date())
  .replace('${commitHash}', commitHash)
  .replace('${commitHashCore}', commitHashCore)
  .replace('${commitHashCSSOM}', commitHashCSSOM)
  .replace('${commitHashLocalize}', commitHashLocalize)

export default {
  entry: lib,
  moduleName: 'cssobj',
  amd: {id: 'cssobj'},
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
    { format: 'umd',  dest: 'dist/cssobj.umd.js'  },
    { format: 'cjs',  dest: 'dist/cssobj.cjs.js'  },
    { format: 'es',   dest: 'dist/cssobj.es.js'   }
  ]
}
