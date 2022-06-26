import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'

export default {
    install(Vue) {
        Vue.component('PageTools', PageTools)   //注册全局工具栏的组件对象
        Vue.component('UploadExcel', UploadExcel)  //上传excel的组件对象
        Vue.component('ImageUpload', ImageUpload)   //上传用户头像的组件对象
    }
}