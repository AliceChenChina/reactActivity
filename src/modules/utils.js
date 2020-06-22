
// 设备类型
const ua = navigator.userAgent
export const device = {
  jr: /jdjr-app/i.test(ua),
  jd: /jdapp/i.test(ua),
  dj: /djcf/i.test(ua),
  wx: /micromessenger/i.test(ua),
  mini: /miniprogram/i.test(ua) || window.__wxjs_environment === 'miniprogram'
}
/**
 * 获取链接参数的值
 * @param {string} key 参数名
 */
export function getQuery(key) {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return null
};


/**
 * 在线预约source来源统计
 * */
export function getSource() {
  let ua_source = "";
  if (device.dj) {//东家app
    ua_source = "djapp_activity";//东家APP环境活动页预约
  } else if (device.jr) { //金融app
    ua_source = "jrapp_activity";//金融APP环境的活动页预约
  } else {
    ua_source = "h5_activity";//H5活动页预约
  }
  return ua_source;
}

/**
 * 返回透传运营参数的url
 * @param {string} url
 */
export function handelUrl(url){
  let channel = getQuery('channel');
  let medium = getQuery('medium');
  let activity = getQuery('activity');
  let sharePin = getQuery('sharePin');
  let shareId = getQuery('shareId');
  if( channel!=null ){
    let appendParams=`channel=${channel}&medium=${medium}&activity=${activity}&shareId=${shareId}`
    if(url.indexOf('?')>0){
      url=`${url}&${appendParams}`
    }else{
      url=`${url}?${appendParams}`
    }
  }
  if(sharePin != null) {
    sharePin = encodeURIComponent(sharePin);
    if(url.indexOf('?')>0){
      url=`${url}&sharePin=${sharePin}`
    }else{
      url=`${url}?sharePin=${sharePin}`
    }
  }
  return url;
}
// url调整
export function jumpUrl(url) {
  if(device.jr){
    window.jrBridge.then(function (res) {
      this.jsOpenWeb({
        jumpUrl: url,          //模块类型或者是跳转h5连接地址
        jumpType: 8,                  //登陆类型（当是h5连接地址时候，这个值最好选择 用 8）
        productId: '',  //商品详情页id,非详情页传空值
        isclose: true    //是否关闭m页，true关，false不关
      })
    });
  }else{
    window.location.href=url
  }
}
// 获得url中的参数
export function getUrlParam(name,search){
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  search = search || window.location.search;
  let r = search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}
// 删除URL中的sharePin参数
export function delUrl(location,name) {
  let loca = window.location
  let baseUrl = loca.origin + loca.pathname + "?";
  let query;
  if(location) {
    let index = location.indexOf('?')
    if(index>0){
      query = location.substring(index+1);
    }
  }else{
    query = loca.search.substr(1);
  }

  if (query && query.indexOf(name)>-1) {
    let obj = {}
    let arr = query.split("&");
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split("=");
      obj[arr[i][0]] = arr[i][1];
    };
    delete obj[name];
    let url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
    return url
  }else{
    return location;
  };
}
/*截取URL字符串 */
export function replaceParamVal(location,paramName,replaceWith) {
  let oUrl = location.toString();
  let re=eval('/('+ paramName+'=)([^&]*)/gi');
  let nUrl = oUrl.replace(re,paramName+'='+replaceWith);
  return nUrl
}
/**
 * 拼接url
 */
export function getEvalUrl(badicUrl, query1, query2) {
  let returnUrl=encodeURIComponent(window.location.href); //返回回调地址
  return `${badicUrl}&${query1}&${query2}&returnUrl=${returnUrl}`
}

export function getEvalUrl_path(returnUrl) {
  if (returnUrl.indexOf('djgj.jd.com') > -1 || returnUrl.indexOf('lee.jr.jd.com') > -1 || returnUrl.indexOf('activity-dongjia.jd.com') > -1 || returnUrl.indexOf('activity.jr.jd.com') > -1) {
    return 'http://minner.jr.jd.com' //测试环境
  }else {
    return 'https://spread.jd.com' //正式环境
  }
}
export function transferTimeToDate(timestamp){
  if(!timestamp){
    return
  }
  let time='';
  if(typeof(timestamp)!='number'){
    timestamp=timestamp.replace(/\-/g, "/")
    time = new Date(timestamp);
  }else{
    time = new Date(timestamp);
  }
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  let data=year+'.'+addZero(month) + '.'+ addZero(day)
  return data;
}
export function  addZero(num){
  num = num + '';
  let result;
  if(num.length === 1) {
    result = '0'+num;
  }
  if(num.length === 2) {
    result = num;
  }

  return result;

}
// 处理主数据，热点区域大小，调整参数
export function handleData(data){
  let deviceWidth = document.documentElement.clientWidth;
  // 1125px 为后台设定的图片固定宽度
  let radio = 1125/deviceWidth;
  let pictureDtoList = data.pictureDtoList ?  data.pictureDtoList : [];
  pictureDtoList.forEach( item => {
    if(item.hotInfo){
      item.hotInfo.forEach(mapItem => {
        // 处理热点值
        if(mapItem.hotCoord){
          let hotCoord = mapItem.hotCoord.split(',').map(hotItem => Math.round(hotItem/radio) );
          mapItem.hotCoord = hotCoord.join(',');
        }
        // 处理埋点
        if(mapItem.hotMd) {
          mapItem.hotMd =`jr|keycount|${data.activityMd}|${mapItem.hotMd}`
        }
        // 判断返回的连接是否有http或者https,没有的话在头部加上http
        if (mapItem.hotType === 1) {
          if (mapItem.jumpUrl.indexOf('http://') === -1){
            if ( mapItem.jumpUrl.indexOf('https://') === -1 ) {
                if( mapItem.jumpUrl.indexOf('openjddjapp') !=-1){//处理唤醒app站外链接
                    mapItem.jumpUrl =  `${mapItem.jumpUrl}`;
                }else{
                    mapItem.jumpUrl =  `${window.location.protocol}//${mapItem.jumpUrl}`;
                }
            }
          }
          mapItem.jumpUrl = handelUrl(mapItem.jumpUrl);
        } else {
          mapItem.activityId = item.activityId;
        }
        return mapItem;
      })
    }
  })
}
