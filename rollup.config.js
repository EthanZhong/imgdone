import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const plugins = [
    resolve(),
    babel(),
    commonjs()
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
                file: pkg.main,
                format: 'cjs',
                freeze,
                sourcemap,
            },
            {
                banner,
                file: pkg.module,
                format: 'esm',
                freeze,
                sourcemap,
            }
        ]
    },
    {
        input,
        plugins: [].concat(plugins, terser({
            output: {
                comments(node, comment) {
                    return comment.line === 1;
                },
            },
            compress: {
                drop_console: true,
            },
        })),
        output: {
            strict: false,
            banner,
            name: 'ImgDone',
            file: 'dist/imgdone.umd.js',
            format: 'umd',
            freeze,
            sourcemap,
        }
    }
];