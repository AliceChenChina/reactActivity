import React, { Component } from 'react';
import '@/styles/pages/nameCard.styl';
import { getSalesInfo } from '@/modules/api';
import { getSalesCardDatas,changeHideAndShadow } from '@/modules/controller';
import {inject, observer} from "mobx-react";
import { getUrlParam } from '@/modules/utils';
import eyeCheck from '@/assets/images/eyeCheck.png';
import shareCheck from '@/assets/images/shareCheck.png';
import appointCard from '@/assets/images/appointCard.png';
import directionWechat from '@/assets/images/shareTip.png';
import wxchat from '@/assets/images/wxchat.png';
import judgeQualifiedInvestor from '@/modules/judgeAllVetify';
let controlAppoint = true;
import appoint from '@/assets/images/appoint.png';
import greyIcon from '@/assets/images/greyIcon.png';
@inject('ifSharePlanner')
@inject('salesNameCard')
@inject('hideShadow')
@observer
export default class SaleNameCard extends Component {

  componentDidMount() {
    const userPin = this.props.match.params.userPin;
    let param = {sharePin: userPin}
    getSalesInfo(param).then(data => {
      let result  = data.resultData
      if(result && result.datas){
        getSalesCardDatas.getData(result.datas);
        document.title = `${result.datas.empName}`;
        const contentData = {ynShare:1,
          shareContent:'期待您的预约咨询，我会为您提供专业的理财服务',
          ShareCode: 5,
          activityTitle: `我是理财师${result.datas.empName}，期待为您服务`,
          shareTitle: `理财师名片分享`,
          sharePicture: result.datas.avatar,
          businessId: userPin,
        }
        const dataAppoint = {
          activityId: getUrlParam('activityId'), // 活动id，必传 --ok
          productId: `理财师名片直接预约`, // 产品id，必传
          appointLimit: 1, // 预约次数限制,1天1次
          appointWay: 1, // 1 财富线上预约 2 线上合格投资者3 财富线下预约4 海外 5 保险 6 其他
          appointType: 3, // 1.产品预约 2.活动预约 3.服务预约
          channel:getUrlParam('channel') === null ? '' : getUrlParam('channel'),  // 预约渠道记录
          medium: getUrlParam('medium') === null ? '' : getUrlParam('medium'),
          activity: getUrlParam('activity') === null ? '' : getUrlParam('activity'),
          source: 'h5', //来源
          sourceUrl: window.location.href,
          sharerPin:getUrlParam('sharePin') === null ? '' : getUrlParam('sharePin'),
          shareId: getUrlParam('shareId') === null ? '' : getUrlParam('shareId'),
          userPin:'',
          appointChannel: 3, // 预约渠道
          serviceName: `理财师名片直接预约`
        }
        judgeQualifiedInvestor.permmisonAll(contentData);
        judgeQualifiedInvestor.ifPlannner(dataAppoint,'name');
      }
    })
  }
  goToShare(){
    changeHideAndShadow.getData(true);
  }
  hideShadow(){
    changeHideAndShadow.getData(false);
  }
  goToAppoint(data,pageData){
    if(!controlAppoint) {
      return false;
    }
    controlAppoint = false
    setTimeout(()=>{
      controlAppoint = true
    },2000)
    judgeQualifiedInvestor.appoitAll(data, pageData);
  }
  render() {
    const pageData = true;
    const { ifSharePlanner } = this.props;
    const { sharePlanner, ifHasWhethered, employeePic, plannerType} = ifSharePlanner;
    let appointImg = ''
    let text = '';
    if(ifHasWhethered) {
      text = '预约咨询'
      appointImg = appoint;
    }else{
      text = '已预约'
      appointImg = greyIcon
    }
    const data = {
      activityId: getUrlParam('activityId'), // 活动id，必传 --ok
      productId: `理财师名片直接预约`, // 产品id，必传
      appointLimit: 1, // 预约次数限制,1天1次
      appointWay: 1, // 1 财富线上预约 2 线上合格投资者3 财富线下预约4 海外 5 保险 6 其他
      appointType: 3, // 1.产品预约 2.活动预约 3.服务预约
      channel:getUrlParam('channel') === null ? '' : getUrlParam('channel'),  // 预约渠道记录
      medium: getUrlParam('medium') === null ? '' : getUrlParam('medium'),
      activity: getUrlParam('activity') === null ? '' : getUrlParam('activity'),
      source: 'h5', //来源
      sourceUrl: window.location.href,
      sharerPin:getUrlParam('sharePin') === null ? '' : getUrlParam('sharePin'),
      shareId: getUrlParam('shareId') === null ? '' : getUrlParam('shareId'),
      userPin:'',
      appointChannel: 3, // 预约渠道
      shareCode: 5,
      serviceName: `理财师名片直接预约`
    }
    const {salesNameCard} = this.props;
    const {hideShadow} = this.props.hideShadow;
    const {empName, classLevel, prov, dummyMobile, avatar, email, profile,certificateVos,shareNumber, checkNum} = salesNameCard.salesNameData;
    const certificateList = certificateVos && certificateVos.map((item,index) => {
      let picture = '';
      picture = <li key={index}>
        <div className='ctfImg' onClick={this.goToShare}>
          <img src={item.certificatePicture}/>
        </div>
        <p>{item.certificateName}</p>
      </li>
      return picture;
    }) || [];
    return (
      <div className='page x-fixed-bottom-bar salesNameCard'>
        <div onClick={this.hideShadow} className={["shadow", hideShadow ? "show" : 'hide'].join(' ')}>
          <img src={directionWechat} className='directionImg'/>
        </div>
        <div className='nameCardWrap'>
          {/*名片*/}
          <div className='nameCardHead'>
            <div className='nameCard'>
              <div className='personalName'>
                {empName || ''}
              </div>
              <div className='personalDuty'>
                <span className='marginR20'>{classLevel || ''}</span><span>{prov || ''}</span>
              </div>
              <div className='cellPhone'>
                {dummyMobile || ''}
              </div>
              <div className='maibox'>
                {email || ''}
              </div>
              <div className='avator'>
                <img src={avatar}/>
              </div>
            </div>
          </div>

          {/*查看数据*/}
          {/*<div className='nameCardCheckData'>*/}
          {/*  <div className='shareBlock'>*/}
          {/*    <p><img src={shareCheck}/></p>*/}
          {/*    <p>{shareNumber || '-'}人分享</p>*/}
          {/*  </div>*/}
          {/*  <div className='checkBlock'>*/}
          {/*    <p><img src={eyeCheck}/></p>*/}
          {/*    <p>{checkNum || '-'}人查看</p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*个人简介*/}
          <div className='personalIntro'>
            <p className='introTitle'>
              个人介绍
            </p>
            <div className='introContent'>
              {profile || ''}
            </div>
          </div>
        </div>
        {/*专业证书*/}
        <div className='certificates'>
          <p className='introTitle' >
            专业证书
          </p>
          <ul className='ctfContent'>
            {
              certificateList
            }
          </ul>
        </div>
        {/*专业证书*/}
        <div className='fixedBottom x-fixed-bottom-bar-inner'>
          <ul>
            <li className='wxchatWrap' onClick={this.goToShare}>
              <div className='textAlignCenter'><img src={wxchat}/></div>
              <div className='textAlignCenter text'>推荐该理财师</div>
            </li>
            <li className='appointWrap' onClick={()=>this.goToAppoint(data,pageData)}>
              <div className='textAlignCenter'><img src={appointImg}/></div>
              <div className='textAlignCenter text'>{text}</div>
            </li>
          </ul>
        </div>

      </div>
    )
  }
}
