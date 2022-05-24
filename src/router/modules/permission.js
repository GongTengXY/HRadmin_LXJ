//员工的路由规则
import Layout from '@/layout'

export default {
    //路由规则
    path : '/permission',
    name : 'permission',   //后面做权限的时候会用到
    component : Layout,
    children : [
        {
            //二级路由的path什么都不用写的时候，此时它表示二级路由默认路由
            path : '',   //这里不用写，则表示 /permission 不但有布局layou还有下面这个员工主页的路由
            component : () => import('@/views/permission'),
            //路由元信息
            meta : {
                title : '权限管理',   //这里用title是因为左侧导航读取了这里的title属性
                icon : 'lock'
            }
        },
    ]
}