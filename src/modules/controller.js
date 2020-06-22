import {action, observable} from 'mobx'
import stores from '../stores'
// 处理运营参数的url
import { jumpUrl, handleData } from '@/modules/utils';
const {loading : loadingState, toast : toastState, popup : popupState, datas : datasState, salesNameCard : salesNameCardState, hideShadow : hideShadowState,permission : permissionState, ifSharePlanner : ifSharePlanner } = stores;
// 主数据
export const getDatas = {
    getData: action('get-data', (data)=>{
        if(data && data.datas){
            handleData(data.datas);
        }
        datasState.activityData = data;
    })
}
// 名片信息
export const getSalesCardDatas = {
    getData: action('get-data', (data)=>{
        salesNameCardState.salesNameData = data;
    })
}
// 名片信息
export const changeHideAndShadow = {
    getData: action('hide-shadow', (data)=>{
        hideShadowState.hideShadow = data;
    })
}
export const getSharePlannerValue = {
    getSharePlannerValue: action('change-sharePlanner',(sharePlanner = '',ifHasWhethered = true, employeePic = '', plannerType=2)=> {
        ifSharePlanner.sharePlanner = sharePlanner;
        ifSharePlanner.ifHasWhethered = ifHasWhethered;
        ifSharePlanner.employeePic = employeePic;
        ifSharePlanner.plannerType = plannerType; // 1直销，2电销，默认为电销，电销隐藏名片入口
    })
}
// 控制是否登录、是否需要投资者证明状态
export const changePermissionState={
    changePermissionState: action('change-permission',(data)=> {
        permissionState.permissionState = data
    })
}
export const loading = {
    show: action('show-loading', () => {
        loadingState.isShow = true
    }),

    hide: action('hide-loading', () => {
        loadingState.isShow = false
    }),
}
let lastToastShowTimer = null
const autoHideToast = action('autohide-toast', () => {
    toastState.isShow = false
})
export const toast = {
    show: action('show-toast', (/** @type {string} */ msg, /** @type {number} */ timeout = 3e3) => {
        if (toastState.isShow) {
            clearTimeout(lastToastShowTimer)
        }
        toastState.msg = msg
        toastState.isShow = true
        lastToastShowTimer = setTimeout(autoHideToast, timeout)
    }),
    hide: action('hide-toast', () => {
        toastState.isShow = false
    }),
}
export const popup = {
    showMessage: action('show-message-modal', (/** @type {string} */ msg) => {
        popupState.message = msg
        popupState.target = 'message'
        popupState.isShow = true
    }),

    showAlert: action('show-alert-modal', (/** @type {string} */ msg, btnText, url) => {
        popupState.alertMsg = msg
        popupState.target = 'alert'
        popupState.isShow = true
        popupState.btnText = btnText ? btnText : '确定'
        popupState.url = url ? url : ''
        document.body.style.height = "100%";
        document.documentElement.style.height = "100%";
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

    }),

    hide: action('hide-popup', () => {
            popupState.isShow = false
            document.body.style.overflow = "auto";
        document.body.style.height = "auto";
        document.documentElement.style.overflow = "auto";
        document.documentElement.style.height = "auto";
            jumpUrl(popupState.url);
    })
}
