import React from 'react'
import '@/styles/pages/renderData.styl'
import judgeQualifiedInvestor from '@/modules/judgeAllVetify';
import { getUrlParam,getSource } from '@/modules/utils';
import {inject, observer} from "mobx-react";
import personalCard from '@/assets/images/personalCard.png';
import appoint from '@/assets/images/appoint.png';
import greyIcon from '@/assets/images/greyIcon.png';
import defaultAtarImg from '@/assets/images/user.png';
let controlAppoint = true;
@inject('ifSharePlanner')
@observer

export default class RenderData extends React.Component {
  componentWillMount() {
    let contentData = this.props.contentData;
    judgeQualifiedInvestor.ifPlannner(contentData);
  }
  consult(data,pageData){
    if(!controlAppoint) {
      return false;
    }
    controlAppoint = false
    setTimeout(()=>{
      controlAppoint = true
    },2000)
    judgeQualifiedInvestor.appoitAll(data, pageData);
  }
  goToNameCard(data) {
    this.props.history.push("/saleNameCard");
  }
    // 图片高度
    getHeight(e = {}) {
      document.body.style.paddingBottom = e.target.height + 'px';
    }
    appoint(data = {}) {
      if(!controlAppoint) {
        return false;
      }
      controlAppoint = false
      setTimeout(()=>{
        controlAppoint = true
      },2000)
        judgeQualifiedInvestor.appoitAll(data);
    };
    render() {
      const pictureDtoList = this.props.pictureDtoList ? this.props.pictureDtoList : [];
      const { ifSharePlanner } = this.props;
      let { sharePlanner, ifHasWhethered, employeePic, plannerType} = ifSharePlanner;
      employeePic =  employeePic || defaultAtarImg;
      const pageData = true;
      const data = {
        activityId: this.props.contentData.id, // 活动id，必传 --ok
        productId: `${sharePlanner}${this.props.contentData.activityTitle}`, // 产品id，必传
        appointLimit: 3, // 预约次数限制,1天1次
        appointWay: 1, // 1 财富线上预约 2 线上合格投资者3 财富线下预约4 海外 5 保险 6 其他
        appointType: 3, // 1.产品预约 2.活动预约 3.服务预约
        channel:getUrlParam('channel') === null ? '' : getUrlParam('channel'),  // 预约渠道记录
        medium: getUrlParam('medium') === null ? '' : getUrlParam('medium'),
        activity: getUrlParam('activity') === null ? '' : getUrlParam('activity'),
        source: getSource(),//预约活动来源
        sourceUrl: window.location.href,
        sharerPin:getUrlParam('sharePin') === null ? '' : getUrlParam('sharePin'),
        userPin: '', // userPin 是一定要传的吗？
        appointChannel: 3, // 预约渠道
        serviceName: `${sharePlanner}${this.props.contentData.activityTitle}`
      }
        const fixedBanner = () => {
          let nameCardCond = '';
          let appointImg = ''
          let text = '';
          if(ifHasWhethered) {
            text = '预约咨询'
            appointImg = appoint;
          }else{
            text = '已预约'
            appointImg = greyIcon
          }
          if (sharePlanner) {
            let target = `activity-dongjia?activityId=${data.activityId}&channel=${getUrlParam('channel')}&medium=${getUrlParam('medium')}&activity=${getUrlParam('activity')}&sharePin=${getUrlParam('sharePin')}&shareId=${getUrlParam('shareId')}#/saleNameCard/${data.sharerPin}`
            document.title = `京东理财师${sharePlanner}为您推荐:${this.props.contentData.activityTitle}`;
            if(plannerType === 2) {
              nameCardCond = <div className="fixedBanner">
                <div className='headerLeftPic'>
                  <img src={employeePic}/>
                </div>
                <div className='salesName'>
                  <p className='leftName'>
                    {sharePlanner}
                  </p>
                  <p className='leftCompany'>
                    理财专家
                  </p>
                </div>
                <div className='nameCard marginR150'></div>
                <div className='nameCard' onClick={()=>this.consult(data,pageData)}>
                  <div className='appointIcon'>
                    <img src={appointImg}/>
                  </div>
                  <div className='cardSpan'>
                    {text}
                  </div>
                </div>
              </div>
            }else{
              nameCardCond = <div className="fixedBanner">
                <div className='headerLeftPic'>
                  <img src={employeePic}/>
                </div>
                <div className='salesName'>
                  <p className='leftName'>
                    {sharePlanner}
                  </p>
                  <p className='leftCompany'>
                    理财专家
                  </p>
                </div>
                <div className='nameCard marginR76'>
                  <div className='nameCardIcon'>
                    <a href={target}>
                      <img src={personalCard}/>
                    </a>
                  </div>
                  <div className='cardSpan'>
                    <a href={target} className=''>查看名片</a>
                  </div>
                </div>
                <div className='nameCard' onClick={()=>this.consult(data,pageData)}>
                  <div className='appointIcon'>
                    <img src={appointImg}/>
                  </div>
                  <div className='cardSpan'>
                    {text}
                  </div>
                </div>
              </div>
            }
          }
                return nameCardCond;
        }
        // 生成图片元素
        const imgList = pictureDtoList.map(item => {
            let picture = '';
            if (item.bottomFlag) {
                picture = <img className="fixedBottom" src={item.pictureLink} useMap={`#${item.id}`} key={item.id} onLoad = { e => {this.getHeight(e)}}/>
            } else {
                picture = <img src={item.pictureLink} useMap={`#${item.id}`} key={item.id}/>
            }
            return picture;
        });
        // 生成热点元素
        const mapList = pictureDtoList.map(item => {
                let map;
                if (!item.hotInfo) {
                    return map = <span key={item.id}></span>;
                }
                map = <map key={item.id} id={item.id} name={item.id}>
                    {
                        item.hotInfo.map(mapItem => {
                                let area;
                                if (mapItem.hotType === 1) {
                                    area = <area key={mapItem.id} shape='rect' coords={mapItem.hotCoord} href={mapItem.jumpUrl}
                                                 alt={mapItem.appointName} target="_blank" clstag={mapItem.hotMd}/>
                                }
                                if (mapItem.hotType === 2) {
                                    area = <area key={mapItem.id} shape='rect' coords={mapItem.hotCoord} onClick={() => {
                                        this.appoint(mapItem)
                                    }} alt={mapItem.appointName} clstag={mapItem.hotMd}/>

                                }
                                return area;
                            }
                        )
                    }
                </map>
                return map;
            }
        );
        return (
            <div className="page page-index">
              {fixedBanner()}
                <div className={["img-wrapper", sharePlanner ? "pt90" : null].join(' ')}>
                    {imgList}
                    {mapList}
                </div>
            </div>
        )
    }

}
