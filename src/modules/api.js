import { request } from './fetch'
import { loading } from './controller'
const apiPrefix = '/api'
let root = '//ms.jr.jd.com'; //测试环境
let url_res = window.location.href;
if (url_res.indexOf('lspread.jd.com') > -1 ) {
  root = '//msinner.jr.jd.com'; //预发环境
}else if(url_res.indexOf('djgj.jd.com') > -1){
  root = '//djgj.jd.com/gateway'; //预发环境
}
// }else if(url_res.indexOf('djgj.jd.com') > -1){
//   root = '//djgj.jd.com/gateway'; //预发环境
// }
const getData = resp => {
  return resp;
}

/**
 *
 * @param {string} url
 * @param {object} data
 * @param {RequestOptions} options
 */
function post(url, data, options = {}) {
    if (options.loading) {
        loading.show()
    }

    const body = { reqData: JSON.stringify(data || {}) }

    return request(`${root}${url}`, { method: 'post', body, dataType: 'json', crossDomain:true,xhrFields: {
            withCredentials: true
        }})
        .then((resp) => {
            if (options.loading) {
                loading.hide()
            }

            return Promise.resolve(resp)
        }, (e) => {
            if (options.loading) {
                loading.hide()
            }

            return Promise.reject(e)
        })
}

export function count() {
    return post('/count', {}, { loading: true })
        .then(getData)
}

export function getCountNumber() {
    return request(`${apiPrefix}/get-count-number`, { method: 'get' })
}
export function weChatShare(){
  const param = {
    jsonPara:{'url': window.location.href},
    "ver":1,
    "systemId":1,
    "channel":"WEB"
  };
  // 预发
  if(window.location.href.indexOf('lspread.jd.com') > 0) {
    return post('/gw/generic/djhw/h5/m/getWxShareData', param).then(getData)
  }else{
    // 生产与测试环境
    return post('/gw/generic/qsxjh/h5/m/weChatShare', param).then(getData)
  }

}
export function ifPlannnerShare(param){
  return post('/gw/generic/qsxjh/h5/m/queryPlannerInfoByPin', param).then(getData)
}
export function queryLoginUserInfoByPin(){
  let param = {
    "ver":1,
    "systemId":1,
    "channel":"WEB",
    jsonPara:{"sharePin":''},
  }
  return post('/gw/generic/qsxjh/h5/m/queryLoginUserInfoByPin', param).then(getData)
}
// 进入页面获取数据
export function getDatas() {
  const href = window.location.href;
  let number;
  const start = href.lastIndexOf('activity_');
  if (href.indexOf('.html') === -1) {
    number = href.substring(start+9);
  } else {
    const end = href.lastIndexOf('.html');
    number = href.substring(start+9, end);
  }
    const param = {
        "ver": 1,
      "systemId": 1,
      "channel": "WEB",
      "jsonPara": {
        "activityUrl": number
    }
    };
    // 测试 /gw/generic/djhw/h5/m/getActivityTemplateData
    return post('/gw/generic/djhw/h5/m/getActivityTemplateData', param, {loading:true}).then(getData)

}
// 判断是否登录
export function isLogin(){
    const param = {
        "ver": 1,
        "systemId": 2,
        "channel": "WEB",
        "jsonPara": {}
    }
    return post('/gw/generic/djhw/h5/m/validateLogin', param).then(getData)
}
// 查询是否签署投资者承诺书
export function queryUserSignPromise(){
    const param =   {
        "ver":1,
        "systemId":1,
        "channel":"WEB",
        jsonPara:{},
    }
    return post('/gw/generic/qsxjh/h5/m/queryUserSignPromiseH5', param).then(getData)
}
// 签署合格投资者承诺书
export function addUserSignPromise(){
    const param = {
        "ver": 1,
        "systemId": 2,
        "channel": "WEB",
        "jsonPara": {}
    }
    return post('/gw/generic/qsxjh/h5/m/addUserSignPromiseH5', param).then(getData)
}
// 是否实名
export function isRealNameNewPund(){
    const param = {
        "ver": 1,
        "systemId": 2,
        "channel": "WEB",
        "jsonPara": {}
    }
    return post('/gw/generic/qsxjh/h5/m/isRealNameNewPund', param).then(getData)
}
// 是否风险评测
export function isEvaluateResult(){
    const param = {
        "ver": 1,
        "systemId": 2,
        "channel": "WEB",
        "jsonPara": {}
    }
    return post('/gw/generic/qsxjh/h5/m/findLastRiskSurvey', param).then(getData)
}
// 是否涉税
export function isFinishRelatedTax(){
    const param = {
        "ver": 1,
        "systemId": 2,
        "channel": "WEB",
        "jsonPara": {}
    }
    return post('/gw/generic/qsxjh/h5/m/isFinishRelatedTax', param).then(getData)
}
//获取公私募的地址
export function getPublicAndPrivateUrl(){
  const param = {
    "ver": 1,
    "systemId": 2,
    "channel": "WEB",
    "jsonPara": {}
  }
  return post('/gw/generic/qsxjh/h5/m/getRiskUrl', param).then(getData)
}
// 预约 /gw/generic/djhw/h5/m/activityAppointment
export function appointActivity(param = {}){
  const finalParam = {
    "channel": "WEB",
    "jsonPara": param
  }
    return post('/gw/generic/djhw/h5/m/activityAppointment', finalParam, {loading:true}).then(getData)
}
// 是否可以预约
export function isCanAppoint(param={}){
  const finalParam = {
    "ver": 1,
    "systemId": 2,
    "channel": "WEB",
    "jsonPara": param
  }
  return post('/gw/generic/qsxjh/h5/m/whetherAppoint', finalParam).then(getData)
}
// 得到理财师名片信息
export function getSalesInfo(param={}){
  const finalParam = {
    "ver": 1,
    "systemId": 1,
    "channel": "WEB",
    "sharePin": param.sharePin
  }
  return post('/gw/generic/qsxjh/h5/m/getGimsSalesInfo', finalParam, {loading:true}).then(getData)
}
// 写入访问日志
// 参数:url--	访问的URL -- 必填
// openId -- 微信openId -- 非必填
export function insertAccessLog(param={}){
  const finalParam = {
    "ver": 1,
    "systemId": 2,
    "channel": "WEB",
    "jsonPara": param
  }
  return post('/gw/generic/qsxjh/h5/m/insertAccessLog', finalParam).then(getData)
}
// 写入分享日志
// shareTitle -- 分享标题 -- 必填
// ShareCode -- 操作代码"1" 文章分享"2" 海报分享"3" 活动分享"4" 产品分享"5" 名片分享 -- 必填
// shareContent -- 分享URL -- 必填
export function insertShareLog(param={}){
  const finalParam = {
    "ver": 1,
    "systemId": 2,
    "channel": "WEB",
    "jsonPara": param
  }
  return post('/gw/generic/qsxjh/h5/m/insertShareLog', finalParam).then(getData)
}
// 获取分享ID
//shareUrl 分享的URL -- 必填
export function getShareId(param={}){
  const finalParam = {
    "ver": 1,
    "systemId": 2,
    "channel": "WEB",
    "jsonPara": param
  }
  return post('/gw/generic/qsxjh/h5/m/getShareId', finalParam).then(getData)
}
// 获取微信openId
// code 用户授权后返回的code
export function getWeChatOpenId(param={}){
  const finalParam = {
    "ver": 1,
    "systemId": 2,
    "channel": "WEB",
    "code": param.code
  }
  return post('/gw/generic/djhw/h5/m/getWeChatOpenId', finalParam).then(getData)
}
// 验证微信授权有效性
// openId 用户openId
export function weChatAuthValid(param={}){
  const finalParam = {
    "ver": 1,
    "systemId": 2,
    "channel": "WEB",
    "openId": param.openId || ''
  }
  return post('/gw/generic/djhw/h5/m/weChatAuthValid', finalParam).then(getData)
}
/**
 * @typedef RequestOptions
 * @property {boolean} loading
 */
