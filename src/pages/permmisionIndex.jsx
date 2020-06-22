import React, {Component} from 'react'
import RenderData from '@/pages/renderData';
import RenderRichText from '@/pages/renderRichText';
import {inject, observer} from 'mobx-react'
import judgeQualifiedInvestor from '@/modules/judgeAllVetify';
import {changePermissionState} from '@/modules/controller';


@inject('permission')
@observer
export default class Index extends Component {
    componentWillMount() {
        let contentData = this.props.contentData;
        let viewPermissions = contentData.viewPermissions;
        let persimissionData = {
            isPermissionAll: false,
            isLogin: false,
            isVetify: false,
            url: ''
        }
        if (viewPermissions === 1) {
            persimissionData.isPermissionAll = true;
            changePermissionState.changePermissionState(persimissionData)
            judgeQualifiedInvestor.permmisonAll(contentData);
        } else if (viewPermissions === 2) {
            judgeQualifiedInvestor.loginAndShare(contentData);
        } else if (viewPermissions === 3) {
            judgeQualifiedInvestor.qualifiedAll(contentData);
        }
    }

    render() {
        let contentData = this.props.contentData;
        let viewPermissions = contentData.viewPermissions;
        const pictureDtoList = contentData.pictureDtoList ? contentData.pictureDtoList : [];
        const attachType = pictureDtoList.length > 0 && pictureDtoList[0].attachType || '1'; // 1图片，3文章
        const {permission} = this.props;
        const {isLogin} = permission.permissionState;

        const renderPage = () => {
            if (viewPermissions === 1 || viewPermissions === 2 && isLogin || viewPermissions === 3) {
                if(attachType === 3) {
                    return <RenderRichText pictureDtoList={pictureDtoList} contentData={contentData}/>;
                }
                return <RenderData pictureDtoList={pictureDtoList} contentData={contentData}/>;

            }
        }
        return (
          <div>
              {renderPage()}
          </div>
        )
    }
}
