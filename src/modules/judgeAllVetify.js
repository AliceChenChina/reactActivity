
import { isLogin, queryUserSignPromise, isRealNameNewPund, isEvaluateResult, isFinishRelatedTax, isCanAppoint, appointActivity, ifPlannnerShare, queryLoginUserInfoByPin, getShareId, getPublicAndPrivateUrl} from '@/modules/api';
import {popup, toast, changePermissionState, getSharePlannerValue } from '@/modules/controller';
import { wxShareAllow, wxShareNoAllow, appShare,hideShare} from '@/modules/share';
import { jumpUrl, getUrlParam, delUrl, replaceParamVal, getEvalUrl, getEvalUrl_path,getSource } from '@/modules/utils';
let returnUrl=encodeURIComponent(window.location.href); //返回回调地址
let persimissionData = {
  isPermissionAll: false,
  isLogin: false,
  isVetify: false,
  url:'',
  text:''
}
const showAlertModal = function(text, btnText, url){
  popup.showAlert(text, btnText, url)
}
const showToast = function(text){
  toast.show(text)
}
class JudgeQualifiedInvestor{
  constructor(){
    // 控制接口是否继续请求
    this.continue=false;
    // 登录成功后记录用户的pin
    this.userPin = '';
    // 预约数据
    this.appointData = {};
    this.employeeName = '';
    this.ifHasWhethered = true;
    this.employeePic = '';
    this.plannerType = '';
    this.shareId = '';
    this.url = '';

  };
  // 所有用户可查看页面--入口
  async permmisonAll(contentData){
    const res = await queryLoginUserInfoByPin();
    if (res.resultData && res.resultData.datas && res.resultData.datas.userPin){
      this.userPin = res.resultData.datas.userPin;
    }
    this.getShareData(contentData);
  };
  // 登录用户可查看 -- 入口
  async loginAndShare(contentData) {
    await this.isLoginJudge();
    this.getShareData(contentData);
  };
  // 合格投资者可查看 -- 入口
  async qualifiedAll(contentData){
    await this.loginAndShare(contentData);
    if(this.continue) await this.queryUserSignPromise1();
    if(this.continue) await this.isRealName();
    if(this.continue) await this.getPublicAndPrivateUrlFn();
    if(this.continue) await this.isEvaluate();
    if(this.continue) await this.isFinishRelatedTax();
  }
  // 预约 -- 入口
  async appoitAll(data, pageData = false){
    if (pageData){
      if (!this.ifHasWhethered){
        showToast('您今日已预约，请勿重复预约!')
        return false;
      }
    }
    await this.isLoginJudge();
    //渠道
    if(pageData){
      this.appointData = data;
      this.appointData.shareId = getUrlParam('shareId') === null ? '' : getUrlParam('shareId');
    }else{
      this.appointData = {
        activityId: data.activityId,
        shareId: getUrlParam('shareId') === null ? '' : getUrlParam('shareId'),
        productId: data.appointName, //产品id OR 名称
        userPin: '', // userPin 是一定要传的吗？
        appointLimit: data.appointNumber,// 预约的次数限制
        appointWay: data.appointType || '', // 预约类型
        appointType: data.appointChannel, // 预约渠道
        source: getSource(),//预约活动来源
        sourceUrl: window.location.href,
        channel:getUrlParam('channel') === null ? '' : getUrlParam('channel'),  // 预约渠道记录 ?channel=渠道名称
        medium: getUrlParam('medium') === null ? '' : getUrlParam('medium'),
        activity: getUrlParam('activity') === null ? '' : getUrlParam('activity'),
        sharerPin: getUrlParam('sharePin') === null ? '' : getUrlParam('sharePin') // 记录分享理财师
      };
      let name;
      // 活动预约
      if (data.appointChannel && data.appointChannel===2){
        name = {
          activityName : data.appointName,
          productKind : data.appointProductType
        }
      } else if (data.appointChannel && data.appointChannel===3) {
        // 服务预约
        name = {
          serviceName : data.appointName
        }
      } else if (data.appointChannel && data.appointChannel===1) {
        // 产品预约
        name = {
          productName : data.appointName,
          productKind : data.appointProductType
        }
      }
      this.appointData = {...this.appointData, ...name};
    }
    if(this.continue) await this.isWhetherAppoint(this.appointData, pageData);
    if(this.continue) await this.appointActivitys(this.appointData, pageData);

  };
  // 处理分享出去的数据
  async getShareData(contentData){
    let shareContenData = JSON.parse(JSON.stringify(contentData));
    let ynShare = shareContenData.ynShare;
    // 判断分享人是否是理财师
    if(ynShare === 1) {
      shareContenData.shareTitle = shareContenData.shareTitle || shareContenData.activityTitle;
      shareContenData.activityId = shareContenData.id
      if (this.userPin) {

        let param = {
          "ver":1,
          "systemId":1,
          "channel":"WEB",
          jsonPara:{"sharePin":this.userPin}
        }
        let res = await ifPlannnerShare(param);
        if (res.resultData && res.resultData.datas && res.resultData.datas.ynPlanner) {
          shareContenData.activityTitle = `京东理财师${res.resultData.datas.employeeName}为您推荐: ${shareContenData.activityTitle}`;
        }
      }
    }
    this.shareChat(shareContenData, ynShare)
  };
  // 分享--根据浏览器传不同参数
  async shareChat(shareData, ynShare){
    let ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') > -1 && ynShare === 1) {
      this.shareAjax(shareData, wxShareAllow)
    } else if (ua.indexOf('micromessenger') > -1 && ynShare === 0) {
      this.shareAjax(shareData, wxShareNoAllow)
    } else if (ua.indexOf('jdjr') > -1 && ynShare === 1){
      this.shareAjax(shareData,appShare)
    } else if (ua.indexOf('jdjr') > -1 && ynShare === 0){
      hideShare();
    }else if (ua.indexOf('android-async-http') > -1 && ynShare === 1){
      this.shareAjax(shareData,appShare)
    } else if (ua.indexOf('android-async-http') > -1 && ynShare === 0){
      hideShare();
    }else if (ua.indexOf('micromessenger') === -1 && ua.indexOf('jdjr') === -1 && ua.indexOf('android-async-http') === -1 && ynShare === 1){
      this.shareAjax(shareData, wxShareAllow)
    } else if (ua.indexOf('micromessenger') === -1 && ua.indexOf('jdjr') === -1 && ua.indexOf('android-async-http') === -1 && ynShare === 0){
      this.shareAjax(shareData, wxShareNoAllow)
    }
  };
  async getShareId(shareCode,businessId){
      let param = {shareCode: shareCode, businessId: businessId};
      let res = await getShareId(param);
      let result = res.resultData;
      if(result && result.errorCode === '00000') {
        this.shareId = result.datas || '';
      }
  };
  async shareAjax(shareData, cb){
    let link;
    let businessId;
    if(window.location.href.indexOf('saleNameCard')!== -1) {
      link = window.location.href
    }else{
      link = window.location.origin + window.location.pathname + window.location.search;
    }
    const pictureDtoList = shareData.pictureDtoList ? shareData.pictureDtoList : [];
    const attachType = pictureDtoList.length > 0 && pictureDtoList[0].attachType; // 1活动，3文章
    let ShareCode = attachType === 3 ? 1 : attachType === 1 ? '3' : shareData.ShareCode;
    businessId = ShareCode === 5? shareData.businessId : shareData.activityId;
    await this.getShareId(ShareCode, businessId);
    let shareParam = {
      ShareCode: ShareCode,
      title:shareData.activityTitle,
      shareTitle: shareData.shareTitle,
      desc:shareData.shareContent,
      shareId: this.shareId,
      link: link,
      imgUrl:shareData.sharePicture || 'https://storage.360buyimg.com/jr-assets/mobile/images/logo.jpg',
    };
    if(this.shareId && (shareParam.link.indexOf('shareId')=== -1)) {
      if(shareParam.link.indexOf('?')<0) {
        shareParam.link=shareParam.link+'?shareId='+ this.shareId;
      }else{
        shareParam.link=shareParam.link+'&shareId='+ this.shareId;
      }
    }else{
      shareParam.link=replaceParamVal(shareParam.link, 'shareId',this.shareId)
    }
    if (this.userPin) {
      this.userPin = encodeURIComponent(this.userPin);
      if(shareParam.link.indexOf('?')<0){
        //增sharePin
        shareParam.link=shareParam.link+'?sharePin='+this.userPin;
      }else{
        if(getUrlParam('sharePin')){
          //改sharePin
          shareParam.link=replaceParamVal(shareParam.link, 'sharePin',this.userPin)
        }else{
          //增sharePin
          shareParam.link=shareParam.link+'&sharePin='+this.userPin;
        }
      }
    } else {
      shareParam.link=delUrl(shareParam.link,'sharePin');
    }
    cb(shareParam)
  };
  //获取该连接是否是理财师分享过来的
  async ifPlannner(contentData,pageData){
    if(pageData){
      isCanAppoint(contentData).then(appoint => {
        if (appoint.resultCode === 0) {
          if (appoint.resultData && appoint.resultData.errorCode === '00000' && appoint.resultData.datas) {
            this.ifHasWhethered = true;
            getSharePlannerValue.getSharePlannerValue(this.employeeName, this.ifHasWhethered, this.employeePic, this.plannerType);
          } else {
            this.ifHasWhethered = false;
            getSharePlannerValue.getSharePlannerValue(this.employeeName, this.ifHasWhethered, this.employeePic, this.plannerType);
          }
        }
      })
    }else{
      let sharePin=getUrlParam('sharePin');
      if(!sharePin) {
        return false;
      }
      let param = {
        "ver":1,
        "systemId":1,
        "channel":"WEB",
        jsonPara:{"sharePin":sharePin},
      }
      // 判断是否是理财会，参数为userPin
      ifPlannnerShare(param).then(res => {
        if(res.resultCode === 0){
          if (res.resultData.datas.ynPlanner) {
            this.employeeName = res.resultData.datas.employeeName;
            this.employeePic = res.resultData.datas.employeePic;
            this.plannerType = res.resultData.datas.plannerType;
            const data = {
              activityId: contentData.id, // 活动id，必传 --ok
              productId: `${this.employeeName}${contentData.activityTitle}`, // 产品id，必传
              appointLimit: 1, // 预约次数限制,1天1次
              appointWay: 1, // 1 财富线上预约 2 线上合格投资者3 财富线下预约4 已分配 (废弃)5 海外线上预约 6 其他类7 保险
              appointType: 3,
              channel:getUrlParam('channel') === null ? '' : getUrlParam('channel'),  // 预约渠道记录
              medium: getUrlParam('medium') === null ? '' : getUrlParam('medium'),
              activity: getUrlParam('activity') === null ? '' : getUrlParam('activity'),
              source: 'h5', //来源
              sourceUrl: window.location.href,
              sharerPin:getUrlParam('sharePin') === null ? '' : getUrlParam('sharePin'),
              userPin: '', // userPin 是一定要传的吗？
              appointChannel: 3, // 预约渠道
              serviceName: `${this.employeeName}${contentData.activityTitle}`
            }
            this.ifHasWhethered = true;
            getSharePlannerValue.getSharePlannerValue(this.employeeName, this.ifHasWhethered, this.employeePic, this.plannerType);
            isCanAppoint(data).then(appoint => {
              if (appoint.resultCode === 0) {
                if (appoint.resultData && appoint.resultData.errorCode === '00000' && appoint.resultData.datas) {
                  this.ifHasWhethered = true;
                  getSharePlannerValue.getSharePlannerValue(this.employeeName, this.ifHasWhethered, this.employeePic, this.plannerType);
                } else {
                  this.ifHasWhethered = false;
                  getSharePlannerValue.getSharePlannerValue(this.employeeName, this.ifHasWhethered, this.employeePic, this.plannerType);
                }
              }
            })
          }
        }
      })
    }
  };
  // 是否登录
  async isLoginJudge(){
    await isLogin().then(res=>{
      if(res.resultCode === 0 && res.resultData){
        this.continue=true;
        this.userPin = res.resultData.datas;
        persimissionData.isLogin = true;
        changePermissionState.changePermissionState(persimissionData)
      }else{
        this.continue=false;
        // 跳转到登录页面
        const loginUrl = window.location.protocol + '//plogin.m.jd.com/user/login.action?appid=100&kpkey=&returnurl=' + returnUrl;
        window.location.href = loginUrl;
      }
    })
  };

  //获取公私募的地址
  async getPublicAndPrivateUrlFn(){
     const res = await getPublicAndPrivateUrl();
     if (res.resultData && res.resultData.errorCode === '00000' && res.resultData.datas) {
       this.continue=true;
       this.url = res.resultData.datas;
     } else {
       this.continue=false;
       showToast('获取风测地址错误！');
     }
  };
  //查询是否勾选过合格者投资承诺书
  async queryUserSignPromise1(){
    await queryUserSignPromise().then(res=>{
      if(res.resultCode === 0 && res.resultData && res.resultData.errorCode==='00000' && res.resultData.datas){
        this.continue=true;
      }else{
        this.continue=false;
        //跳转到承诺书页面
        let openUrl=getEvalUrl_path(returnUrl) + '/spread-activity/signCommitment.html?returnUrl=' + returnUrl;
        jumpUrl(openUrl);
      }
    })
  };
  //查询是否完成实名认证
  async isRealName(){
    await isRealNameNewPund().then(res=>{
      if (res.resultCode === 0 && res.resultData && res.resultData.errorCode === '00000'|| res.resultCode === 0 && res.resultData && res.resultData.errorCode == '02212') {//当code = 02212 已实名但实名的身份证号不足18位时  也显示实名“已完成” 暂时前端判断为 true
        this.continue=true;
      }else{
        this.continue=false;
        let url = 'https://msc.jd.com/auth/loginpage/wcoo/toAuthPage?source=101&businessType=448&directReturnUrl=' +returnUrl;
        showAlertModal('私募产品仅对特定人群开放，为保障您的投资权益，请先完成实名认证。', '去认证', url);
        changePermissionState.changePermissionState(persimissionData);
      }
    })
  };
  //查询是否完成风险评测
  async isEvaluate(){
    let url = getEvalUrl(this.url, 'showType=1', 'btnType=0');
    let textObj = {title:'',btnName:''};
     const res = await isEvaluateResult().then(res=>{
      if(res.resultCode === 0 && res.resultData && res.resultData.datas  && res.resultData.datas.isInvalid === 1){
        this.continue=true;
        return false;
      }else if (res.resultData && res.resultData.errorCode==='02218'){
        this.continue=false;
        textObj.title='私募产品仅对特定人群开放，您的风测结果已过期，请重新评测。';
        textObj.btnName = '重新评测';
      } else {
        this.continue=false;
        textObj.title='私募产品仅对特定人群开放，为保障您的投资权益，请先进行风险测评。';
        textObj.btnName = '去测评';
      }
      showAlertModal(textObj.title, textObj.btnName, url);
      changePermissionState.changePermissionState(persimissionData);
    })
  }
  //查询是否涉税
  async isFinishRelatedTax(){
    let url = getEvalUrl(this.url, 'showType=3', 'btnType=0');
    await isFinishRelatedTax().then(res=>{
      if(res.resultCode === 0 && res.resultData && res.resultData.errorCode==='00000' && res.resultData.datas){
        this.continue=true;
        persimissionData.isVetify = true;
        changePermissionState.changePermissionState(persimissionData);
      }else{
        this.continue=true;
        showAlertModal('私募产品仅对特定人群开放，为保障您的投资权益，请先提交涉税信息。', '去提交', url);
        persimissionData.url = url;
        changePermissionState.changePermissionState(persimissionData);
      }
    })
  }
// 判断是否预约接口
  async isWhetherAppoint(data){
    await isCanAppoint(this.appointData).then(res => {
      if (res.resultCode === 0) {
        if (res.resultData && res.resultData.errorCode === '00000' && res.resultData.datas) {
          this.continue = true;
        } else {
          this.continue = false;
          showToast(res.resultData.errorMessage);
        }
      } else {
        showToast(res.resultMsg)
      }
    })
  }
  // 判断是否预约接口
  appointActivitys(appointData, pageData){
    appointActivity(this.appointData).then(res => {
      if (res.resultData && res.resultData.errorCode === '00000') {
        if(appointData.appointType === 3 && appointData.shareCode === 5) {
          this.continue = true;
          showToast('预约成功，该理财师会尽快与您联系');
        }else {
          this.continue = true;
          showToast(res.resultData.errorMessage);
        }
        if (pageData) {
          this.ifHasWhethered = false;
          getSharePlannerValue.getSharePlannerValue(this.employeeName, this.ifHasWhethered, this.employeePic, this.plannerType);
        }

      }else{
        showToast(res.resultData.errorMessage);
      }

    })
  }
}
export  default new JudgeQualifiedInvestor();

