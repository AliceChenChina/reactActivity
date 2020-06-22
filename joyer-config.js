const path = require('path');
const resolve = dir => path.join(__dirname, dir);

const history = require('connect-history-api-fallback')

const projName = 'activity-dongjia'

const mainStyle = path.resolve('./src/styles/main.styl')
const normalizeCSSPath = path.resolve(__dirname, './node_modules/normalize.css')

function mergeWebpackConfig(config) {
    const rule = config.module.rules.filter(r => r.test && r.test.test('a.jsx'))[0]
    rule.use.options.plugins.push('react-hot-loader/babel')
    return config
}


module.exports = {
    useHistory:true,
    type: 'singlePage',
    dev: {
        // isAutoOpenBrowser: false,
        env: {
            mode: 'dev',
            prefix: 'http://ms.jr.jd.com',
            baseUrl: `/${projName}`,
        },
        path: `/${projName}`,
        port: '8081',
        cssBundleFiles: [ mainStyle ],
        needsCompile: [ normalizeCSSPath ],
        mergeWebpackConfig,
    },
    build: {
        // 测试环境 http://msinner.jr.jd.com
        test: {
            env: {
                mode: 'test',
                prefix: '',
                baseUrl: `/${projName}`,
            },
            path: `/${projName}`,
            publicPath: `/${projName}`,
            cssBundleFiles: [ mainStyle ],
            needsCompile: [ normalizeCSSPath ],

            mergeWebpackConfig,
        },
        // 预发环境
        minner: {
            env: {
                mode: 'minner',
                prefix: 'http://msinner.jr.jd.com',
                baseUrl: `/${projName}`,
            },
            path: `/${projName}`,
            publicPath: `/${projName}`,
            cssBundleFiles: [ mainStyle ],
            needsCompile: [ normalizeCSSPath ],

            mergeWebpackConfig,
        },
        // 线上环境
        prod: {
            env: {
                mode: 'prod',
                prefix: 'https://ms.jr.jd.com',
                baseUrl: `/${projName}`,
            },
            path: `/${projName}`,
            publicPath: `/${projName}`,
            cssBundleFiles: [ mainStyle ],
            needsCompile: [ normalizeCSSPath ],

            mergeWebpackConfig,
        },
    },
    alias: {
        '@': path.resolve('src')
    }
}
