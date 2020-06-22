import 'whatwg-fetch'

const CT_URLENCODED = 'application/x-www-form-urlencoded'
const CT_JSON = 'application/json'
const resolveContentType = type => `${type}; charset=UTF-8`

/**
 * @param {object} obj
 * @returns {string}
 */
function stringifyForm(obj) {
    return Object.keys(obj)
        .map(k => `${k}=${encodeURIComponent(obj[k] + '')}`)
        .join('&')
}

/**
 * @param {string} url
 * @param {object} fetchOptions
 */
export function request(url, options = {}) {
    const method = options.method || 'get'
    options.method = method

    if (method.toLowerCase() === 'post') {
        const body = options.body
        const headers = options.headers || {}
        const ct = headers['Content-Type'] || resolveContentType(CT_URLENCODED);
        headers['Content-Type'] = ct
        if (body) {
            if (ct.indexOf(CT_URLENCODED) > -1) {
                options.body = stringifyForm(body)
            } else if (ct.indexOf(CT_JSON) > -1) {
                options.body = JSON.stringify(body)
            }
        }

        options.headers = headers;
    }

    return window.fetch(url, {
            mode: 'cors',
            credentials: 'include',
            ...options
        }).then((resp) => {
            if (resp.status >= 400) return Promise.reject(resp.status)
            return resp.json()
        })
}
