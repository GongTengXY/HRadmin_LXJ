import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import Lang from './Lang'
import TagsView from './TagsView'

export default {
    install(Vue) {
        Vue.component('PageTools', PageTools)   //注册全局工具栏的组件对象
        Vue.component('UploadExcel', UploadExcel)  //上传excel的组件对象
        Vue.component('ImageUpload', ImageUpload)   //上传用户头像的组件对象
        Vue.component('ScreenFull', ScreenFull)    //全屏按钮组件对象
        Vue.component('ThemePicker', ThemePicker)   //系统的主题色调更换组件对象
        Vue.component('Lang', Lang)           //对系统的国际化语言切换组件对象
        Vue.component('TagsView', TagsView)    //对整个系统实现多页签的组件对象
    }
}