import React, { Component } from 'react';
import overImg  from '@/assets/images/over.png';
import notStartImg from '@/assets/images/notStart.png';
import '@/styles/pages/attention.styl';
export default class Attention extends Component {
  render() {
    const imgObj = this.props.pageStatus === '20002' ? {src:notStartImg,text:"活动未开始，敬请期待..."} : this.props.pageStatus === '20003' ? {src:overImg,text:"您来晚啦，活动已结束..."} : this.props.pageStatus === '20007' ? {src:overImg,text:"活动已下线"} : {}
    return (
      <div className="page page-index">
        <div className="img-wrapper-warning">
          <img  src={imgObj.src} alt={imgObj.text}/>
        </div>
        <div className="result">
          {imgObj.text}
        </div>
      </div>
    )
  }
}
