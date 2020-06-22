
import { weChatShare, insertShareLog } from '@/modules/api';
import {toast} from '@/modules/controller';
import {getQuery} from '@/modules/utils'
import { getUrlParam } from '@/modules/utils';
const showToast = function(text){
  toast.show(text)
}
const shareImg = 'https://storage.360buyimg.com/jr-assets/mobile/images/logo.jpg';

//允许微信分享
async function wxShareAllow(shareData) {
  weChatShare().then(res => {
    if(res.resultCode === 0){
      let data = res.resultData.datas || {};
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['onMenuShareTimeline','showMenuItems', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem']
      });
      wx.ready(() => {
        wx.hideAllNonBaseMenuItem();
        // wx.hideMenuItems({
        //   menuList: [
        //     //传播类
        //     //"menuItem:share:timeline",//分享到朋友圈
        //     //"menuItem:share:appMessage",//发送给朋友
        //     "menuItem:share:qq",//分享到QQ
        //     "menuItem:share:weiboApp",//分享到Weibo
        //     "menuItem:favorite",//收藏
        //     "menuItem:share:facebook",//分享到FB
        //     "menuItem:share:QZone",//分享到 QQ 空间
        //     //保护类
        //     "menuItem:editTag",//编辑标签
        //     "menuItem:delete",//删除
        //     "menuItem:copyUrl",//复制链接
        //     "menuItem:originPage",//原网页
        //     "menuItem:readMode",//阅读模式
        //     "menuItem:openWithQQBrowser",//在QQ浏览器中打开
        //     "menuItem:openWithSafari",//在Safari中打开
        //     "menuItem:share:email",//邮件
        //     "menuItem:share:brand"//一些特殊公众号
        //
        //   ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
        // });
        wx.showMenuItems({
          menuList: [
            //传播类
            "menuItem:share:timeline",//分享到朋友圈
            "menuItem:share:appMessage",//发送给朋友

          ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
        });
        //自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
        let that = this;
        //分享到朋友圈接口
        wx.onMenuShareAppMessage({
          title: shareData.title, // 分享标题
          desc: shareData.desc, // 分享描述
          link: shareData.link, // 分享链接-在安全域名中
          imgUrl: shareData.imgUrl,
          success:function(res) {
            // alert('回调成功')
            // alert(JSON.stringify(res))
          },
          cancel: function (res) {
            // alert('取消')
            // 用户取消分享后执行的回调函数
          },
          trigger: async function(res) {
           // alert('分享要传参数')
            let param = {
              shareTitle: shareData.shareTitle,
              ShareCode: shareData.ShareCode, //"1" 文章分享"2" 海报分享"3" 活动分享"4" 产品分享"5" 名片分享
              shareContent: shareData.link,
              shareId: shareData.shareId,
              sharePin:getUrlParam('sharePin'),
              activity:getUrlParam('activity'),
              medium: getUrlParam('medium'),
              channel: getUrlParam('channel'),
            }
           // alert(JSON.stringify(param));
            insertShareLog(param).then(res=>{
            //  alert('分享日志ok')
            });
          }
        });
        wx.onMenuShareTimeline({
          title: shareData.title, // 分享标题
          desc: shareData.desc, // 分享描述
          link: shareData.link, // 分享链接-在安全域名中
          imgUrl: shareData.imgUrl,
          success(res) {
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          },
          trigger: async function(res) {
            let param = {
              shareTitle: shareData.shareTitle,
              ShareCode: shareData.ShareCode, //"1" 文章分享"2" 海报分享"3" 活动分享"4" 产品分享"5" 名片分享
              shareContent: shareData.link,
              shareId: shareData.shareId,
              sharePin:getUrlParam('sharePin'),
              activity:getUrlParam('activity'),
              medium: getUrlParam('medium'),
              channel: getUrlParam('channel'),
            }
            insertShareLog(param).then(res=>{
            });
          }
        });
      });
      wx.error((res) => {
      })

    }else {
      showToast(res.resultMsg);
    }
  })
}
// 直接调取--发送给好友
function sendAppMessage(shareData){
  let that = this;
  wx.invoke(
    "sendAppMessage", {
      title: shareData.title,
      desc:  shareData.desc,
      link:  shareData.link,
      imgUrl: shareData.imgUrl,
    },res=>{
      if (res.err_msg === "shareAppMessage:ok") {
        that.shareSuccess();
      }
    }
  );
}

// 微信分享
function shareWeChart(){
  let that = this;
  wx.invoke(
    "shareWechatMessage", {
      title: this.title,
      desc:  this.desc,
      link:  this.link,
      imgUrl: this.imgUrl,
    }, res => {
      if (res.err_msg === "shareWechatMessage:ok") {
        that.shareSuccess();
      }
    }
  );
}
//微信不允许分享
async function wxShareNoAllow(shareData) {
  weChatShare().then(res => {
    if(res.resultCode === 0){
      let data = res.resultData.datas || {};
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['hideAllNonBaseMenuItem']
      });
      wx.ready(() => {
        wx.hideAllNonBaseMenuItem();
      });
      wx.error((res) => {
      })

    }else {
      showToast(res.resultMsg);
    }
  })
}
//金融APP分享
function appShare(shareData) {
  // 常见使用方法如下：
  window.jrBridge.then(function(res) {
    this.jsToNaWeiXin({
      isShow:true,
      optionType:1,
      btnText:'分享',
      shareDate:{
        appId:'', //可选填
        img:shareData.imgUrl,
        link:shareData.link,
        desc:shareData.desc,
        title: shareData.title,
        friendesc: shareData.desc,
        type:''
      },
      shareDataNew:{
        isLogin:"0",
        id:'5',
        imageUrl:shareData.imgUrl,
        link: [
          shareData.link,
          shareData.link,
        ],
        linkTitle:shareData.title,
        linkSubtitle:shareData.desc,
        channels:['0', '1'],
      }
    });
    // 分享回调
    this.jsToGetResp(function(d){
      if (typeof d != 'object') {
        d = $.parseJSON(d);
      }
      if (d.share) {
        if(d.share.shareState === 2 || d.share.shareState === '2'){
          let param = {
            shareTitle: shareData.shareTitle,
            ShareCode: shareData.ShareCode, //"1" 文章分享"2" 海报分享"3" 活动分享"4" 产品分享"5" 名片分享
            shareContent: shareData.link,
            shareId: shareData.shareId,
            sharePin:getUrlParam('sharePin'),
            activity:getUrlParam('activity'),
            medium: getUrlParam('medium'),
            channel: getUrlParam('channel'),
          }
          insertShareLog(param).then(res=>{
          });
        }
      }
    },{"type":1,"data":''});
  });
}

// 隐藏app分享
function hideShare() {
  window.jrBridge.then(function (res) {
    this.setNaviBar({
      version: 100,
      title: document.title,
      moreItem: true,
      hideTools: true
    })
  })
}
export { wxShareAllow, wxShareNoAllow, appShare, hideShare}
