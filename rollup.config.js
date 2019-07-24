import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const plugins = [
    resolve(),
    commonjs(),
    babel()
];

const sourcemap = true;
const freeze = false;
const input = 'src/index.js';
const external = Object.keys(pkg.dependencies);
const compiled = (new Date()).toUTCString().replace(/GMT/g, "UTC");

const banner = `/**
 * ${pkg.name} - v${pkg.version}
 * https://github.com/EthanZhong/imgdone
 * Compiled ${compiled}
 *
 * ${pkg.name} is licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license
 */`;

export default [
    {
        input,
        plugins,
        external,
        output: [
            {
                banner,
                file: 'dist/imgdone.cjs.js',
                format: 'cjs',
                freeze,
                sourcemap,
            },
            {
                banner,
                file: 'dist/imgdone.esm.js',
                format: 'esm',
                freeze,
                sourcemap,
            }
        ]
    }
];