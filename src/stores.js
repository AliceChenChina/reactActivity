import { observable} from 'mobx'

// observable 把状态转为可观察的状态
// action 改变状态的函数

export default {
    /** @type LoadingState */
    loading: observable({
        isShow: false,
    }),

    /** @type ToastState */
    toast: observable({
        isShow: false,
        msg: '',
    }),

    /** @type PopupState */
    popup: observable({
        isShow: false,
        target: '',
        message: '',
        alertMsg: '',
        btnText:'确定',
        url:''
    }),
    // 获取主数据
    datas: observable({
       activityData: {
           name: '',
           errorCode:'',
           activityTitle: ''
       }
    }),
    // 获取理财师名片信息
    salesNameCard: observable({
        salesNameData: {
        }
    }),
    // 获取理财师名片信息
    hideShadow: observable({
        hideShadow: false
    }),
    // 控制是否登录、是否需要投资者证明状态
    permission:observable({
        permissionState:{
            isPermissionAll: false,
            isLogin: false,
            isVetify: false,
            url:'',
            continue:true
        }
    }),
    ifSharePlanner:observable({
        sharePlanner: '',
        ifHasWhethered: false
    })

}

/**
 * @typedef LoadingState
 * @property {boolean} isShow
 */

/**
 * @typedef ToastState
 * @property {boolean} isShow
 * @property {string} msg
 */

/**
 * @typedef PopupState
 * @property {boolean} isShow
 * @property {string} target
 * @property {string} message
 * @property {string} alertMsg
 */
