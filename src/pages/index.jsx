import React, { Component } from 'react'
// errorCode 为20002，20003，20007时渲染的组件
import Attention from '@/pages/Attention';
// errorCode 为00000时渲染的组件
import PermmisionIndex from '@/pages/permmisionIndex';
// 注入state值
import { inject, observer } from 'mobx-react'
// 数据请求函数
import { getDatas as getData, insertAccessLog, getWeChatOpenId, weChatAuthValid} from '@/modules/api';
import { getDatas, toast } from '@/modules/controller';
import {getQuery, getUrlParam} from '@/modules/utils'
window.jrBridge = window.jrBridge || jsBridgeV3.onReady();
@inject('datas')
@observer
export default class Index extends Component {
  // errorCode 为20001，20006弹框
  showToast(text) {
    toast.show(text);
  }

  insertAccessLogFn(){
    // 调用记录日志接口
    // 调用记录日志接口
    let param = {
      url: window.location.href, // 访问的URL
      openId: window.localStorage.getItem('openId')|| '', // 微信UnionId
      shareId:getUrlParam('shareId') === null ? '' : getUrlParam('shareId'),
      sharePin: getUrlParam('sharePin') === null ? '' : getUrlParam('sharePin'),
      activity: getUrlParam('activity') === null ? '' : getUrlParam('activity'),
      medium: getUrlParam('medium') === null ? '' : getUrlParam('medium'),
      channel:getUrlParam('channel') === null ? '' : getUrlParam('channel'),
    }
//alert(JSON.stringify(param))
    insertAccessLog(param).then(data => {
    })
  }
  componentDidMount(){
    if(window.location.hash.indexOf('#/saleNameCard') !== 0) {
      getData().then(data => {
        getDatas.getData(data.resultData);
      })
    }
    // 微信授权登陆
    let ua= window.navigator.userAgent.toLowerCase();
    if ((ua.indexOf('wxwork') === -1) && ua.indexOf('micromessenger') > -1) {
      // code 获取openID
      let code = getQuery('code');
      if (code) {
        getWeChatOpenId({ code })
          .then(res => {
            const { resultData: { datas } } = res;
            if (datas) {
              window.localStorage.setItem('openId', datas);
              // alert(`你授权成功，openId: ${window.localStorage.getItem('openId')}`)
              this.insertAccessLogFn()
            }
          });
      }else {
        const openId = window.localStorage.getItem('openId');
        let appid = window.location.href.indexOf('djgj.jd.com')>-1 ? 'wx9859318dfe2cf4d4' : 'wx239356890a5ffdee';
        const toWeChatHref = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
        if (openId) {
          //曾经授权登陆了，验证openId的有效性
          weChatAuthValid({ openId })
            .then(res => {
              const { resultData: { datas } } = res;
              if (!datas) {
                // alert(`openId: ${window.localStorage.getItem('openId')}验证时效性成功！`)
                // 授权登陆失效了
                window.localStorage.removeItem('openId');
                window.location.href = toWeChatHref;
              } else {
                // alert(`openId: ${window.localStorage.getItem('openId')}验证时效性成功！`)
                this.insertAccessLogFn()
              }
            });
        } else {
          // 没有授权登陆
          window.location.href = toWeChatHref;
        }
      }
    } else {
      this.insertAccessLogFn()
    }
  }
  render() {
    const {datas} = this.props;
    const {errorCode,errorMessage,datas : contentData} = datas.activityData;
     // 设置活动标题
      document.title = contentData && contentData.activityTitle || errorMessage || '加载中...';
      const renderPage = () => {
        if(errorCode === '20002' || errorCode === '20003' || errorCode === '20007'){
          return <Attention pageStatus={errorCode}/>;
        }else if (errorCode === '00000'){
          return <PermmisionIndex contentData={contentData}/>
        }else if (errorCode === '20001'){
          this.showToast('访问地址错误！请输入正确的访问地址！');
        }else if (errorCode === '20006'){
          this.showToast('系统异常！');
        }
      }
    return (
      <div>
        {renderPage()}
      </div>
    )
    }
}
