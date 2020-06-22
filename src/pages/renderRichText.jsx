import React from 'react'
import '@/styles/pages/renderData.styl'
import judgeQualifiedInvestor from '@/modules/judgeAllVetify';
import { getUrlParam,transferTimeToDate } from '@/modules/utils';
import {inject, observer} from "mobx-react";
import personalCard from '@/assets/images/personalCard.png';
import greyIcon from '@/assets/images/greyIcon.png';
import appoint from '@/assets/images/appoint.png';
import defaultAtarImg from '@/assets/images/user.png';
let controlAppoint = true;
@inject('ifSharePlanner')
@observer

export default class RenderData extends React.Component {
  constructor(){
    super();
    this.position= {
      oriOffestLeft: 0, // 移动开始时进度条的点距离进度条的偏移值
        oriX: 0, // 移动开始时的x坐标
        maxLeft: 0, // 向左最大可拖动距离
        maxRight: 0 // 向右最大可拖动距离
    };
    this.flag =false;
  }
  componentWillMount() {
    let contentData = this.props.contentData;
    judgeQualifiedInvestor.ifPlannner(contentData);
  }
  componentDidMount(){
    this.playAndPause()
  }
  playAndPause(){
    // 控制音乐的播放与暂停
    let audioWrap = document.querySelectorAll('.audio-wrapper');
    for(let i=0; i<audioWrap.length; i++) {
      let audio = audioWrap[i].querySelector('audio')
      let audioLeft = audioWrap[i].querySelector('.audio-left')
      let playIcon = audioLeft.querySelector('.playicon')
      let pauseIcon = audioLeft.querySelector('.pauseicon')
      let audioRight = audioWrap[i].querySelector('.audio-right')
      this.dragProgressDotEvent(audio);
      audioLeft.addEventListener('click', function () {
        if (audio.paused) {
          audio.play();
          playIcon.style.display = 'none'
          pauseIcon.style.display = 'block'
        } else {
          audio.pause();
          playIcon.style.display = 'block'
          pauseIcon.style.display = 'none'
        }
      }, false);
      // 监听音频播放时间并更新进度条
      audio.addEventListener('timeupdate',  ()=> {
        this.updateProgress(audio);
      }, false);
      // 监听播放完成事件
      audio.addEventListener('ended', () => {
        this.audioEnded(audio);
      }, false);
      // 点击进度条跳到指定点播放
      let progressBarBg = audioRight.querySelector('.progress-bar-bg');
      progressBarBg.addEventListener('touchstart',  (event) => {
        // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
        if (!audio.paused || audio.currentTime != 0) {
          let pgsWidth = parseFloat(window.getComputedStyle(progressBarBg, null).width.replace('px', ''));
          let offsetX = event.offsetX || event.touches[0].clientX;
          let audioLeftWidth = audioLeft.clientWidth;
          console.log('pingmu',audioLeftWidth)
          let rate = (offsetX-audioLeftWidth) / pgsWidth;
          audio.currentTime = audio.duration * rate;
          this.updateProgress(audio);
        }
      }, false);
    }
  }
  updateProgress(audio){
    let value = audio.currentTime / audio.duration;
    audio.parentNode.querySelector('.progressBar').style.width = value * 100 + '%';
    audio.parentNode.querySelector('.progressDot').style.left = value * 100 + '%';
    audio.parentNode.querySelector('.audioCurTime').innerText = this.transTime(audio.currentTime);

  }
  /**
   * 音频播放时间换算
   * @param {number} value - 音频当前播放时间，单位秒
   */
  transTime(value) {
    let time = "";
    let h = parseInt(value / 3600);
    value %= 3600;
    let m = parseInt(value / 60);
    let s = parseInt(value % 60);
    if (h > 0) {
      time = this.formatTime(h + ":" + m + ":" + s);
    } else {
      time = this.formatTime(m + ":" + s);
    }

    return time;
  }

  /**
   * 格式化时间显示，补零对齐
   * eg：2:4  -->  02:04
   * @param {string} value - 形如 h:m:s 的字符串
   */
  formatTime(value) {
    let time = "";
    let s = value.split(':');
    let i = 0;
    for (; i < s.length - 1; i++) {
      time += s[i].length == 1 ? ("0" + s[i]) : s[i];
      time += ":";
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];

    return time;
  }
  /**
   * 播放完成时把进度调回开始的位置
   */
  audioEnded(audio) {
    audio.parentNode.querySelector('.progressBar').style.width = 0;
    audio.parentNode.querySelector('.progressDot').style.left = 0;
    audio.parentNode.querySelector('.audioCurTime').innerText = this.transTime(0);
    let playIcon = audio.parentNode.querySelector('.playicon')
    let pauseIcon = audio.parentNode.querySelector('.pauseicon')
    playIcon.style.display = 'block'
    pauseIcon.style.display = 'none'
  }
  dragProgressDotEvent(audio) {
    let dot = audio.parentNode.querySelector('.progressDot');

    // 鼠标按下时

    dot.addEventListener('mousedown', this.down , false);
    dot.addEventListener('touchstart', this.down, false);

    // 开始拖动
    document.addEventListener('mousemove', this.move, false);
    document.addEventListener('touchmove', this.move, false);

    // 拖动结束
    document.addEventListener('mouseup', this.end, false);
    document.addEventListener('touchend', this.end, false);

  }
  down(event) {
    let audio = event.target.parentNode.parentNode.parentNode.querySelector('audio');
    let dot = event.target;
    let progressBarBg = dot.parentNode;
    if (!audio.paused || audio.currentTime != 0) { // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
      this.flag = true;
      this.position.oriOffestLeft = dot.offsetLeft;
      this.position.oriX = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousedown和touchstart事件
      this.position.maxLeft = this.position.oriOffestLeft; // 向左最大可拖动距离
      this.position.maxRight = progressBarBg.offsetWidth - this.position.oriOffestLeft; // 向右最大可拖动距离

      // 禁止默认事件（避免鼠标拖拽进度点的时候选中文字）
      if (event && event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      // 禁止事件冒泡
      if (event && event.stopPropagation) {
        event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
    }
  }

  move(event) {
    let audio = event.target.parentNode.parentNode.parentNode.querySelector('audio');
    let progressBarBg = event.target.parentNode;
    if (this.flag) {
      var clientX = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousemove和touchmove事件
      var length = clientX - this.position.oriX;
      if (length > this.position.maxRight) {
        length = this.position.maxRight;
      } else if (length < -this.position.maxLeft) {
        length = -this.position.maxLeft;
      }
      var pgsWidth = parseFloat(window.getComputedStyle(progressBarBg, null).width.replace('px', ''));
      var rate = (this.position.oriOffestLeft + length) / pgsWidth;
      audio.currentTime = audio.duration * rate;
      this.updateProgress(audio);
    }
  }
  end() {
    this.flag = false;
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
    judgeQualifiedInvestor.appoitAll(data);
  };
  render() {
    let { ifSharePlanner, contentData, pictureDtoList} = this.props;
    const {activityTitle, remarkName, startTime} = contentData;
    pictureDtoList = pictureDtoList || [];
    let articleTime =transferTimeToDate(startTime)
    let { sharePlanner, ifHasWhethered, employeePic, plannerType} = ifSharePlanner;
    employeePic =  employeePic || defaultAtarImg;
    let productId = `${sharePlanner}${activityTitle}`;
    if(productId.length > 40) {
      productId = productId.substring(0,40);
    }
    const pageData = true;
    const data = {
      activityId: contentData.id, // 活动id，必传 --ok
      productId: `${productId}`, // 产品id，必传
      appointLimit: 3, // 预约次数限制,1天1次
      appointWay: 1, // 1 财富线上预约 2 线上合格投资者3 财富线下预约4 海外 5 保险 6 其他
      appointType: 3, // 1.产品预约 2.活动预约 3.服务预约
      channel:getUrlParam('channel') === null ? '' : getUrlParam('channel'),  // 预约渠道记录
      medium: getUrlParam('medium') === null ? '' : getUrlParam('medium'),
      activity: getUrlParam('activity') === null ? '' : getUrlParam('activity'),
      shareId: getUrlParam('shareId') === null ? '' : getUrlParam('shareId'),
      source: 'h5', //来源
      sourceUrl: window.location.href,
      sharerPin:getUrlParam('sharePin') === null ? '' : getUrlParam('sharePin'),
      userPin: '', // userPin 是一定要传的吗？
      appointChannel: 3, // 预约渠道
      serviceName: `${sharePlanner}${activityTitle}`
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
        document.title = `京东理财师${sharePlanner}为您推荐:${activityTitle}`;
        let text = '预约咨询';
        if(plannerType === 2) {
          nameCardCond = <div className="fixedBanner richTextShadow">
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
          nameCardCond = <div className="fixedBanner richTextShadow">
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
        // 生成图片元
        const imgList = pictureDtoList[0].pictureLink;
      console.log('999',imgList);
        return (
            <div className="page page-index">
              {fixedBanner()}
              <div className={['paddingLeft32','paddingRight32','widthMax100',sharePlanner ? "pt90" : null, 'marginTop32'].join(' ')} >
                <p className='articleHeader'>{activityTitle}</p>
                <p className='articleTime'>{articleTime}</p>
                <p className='articleMark'>{remarkName}</p>
                <div className='articleInfo' dangerouslySetInnerHTML={{
                  __html: imgList
                }}>

                </div>
                <p className="noDuty">
                  免责声明：文章内容仅供参考，不构成投资建议。投资者据此操作，风险自担。文章内容如有涉及侵权烦请联系，我们将第一时间处理。
                </p>
              </div>
            </div>
        )
    }

}
