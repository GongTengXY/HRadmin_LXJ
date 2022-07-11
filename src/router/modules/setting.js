//员工的路由规则
import Layout from '@/layout'

export default {
    //路由规则
    path : '/settings',
    name : 'settings',   //后面做权限的时候会用到
    component : Layout,
    children : [
        {
            //二级路由的path什么都不用写的时候，此时它表示二级路由默认路由
            path : '',
            name : 'settings',   
            component : () => import('@/views/setting'),
            //路由元信息
            meta : {
                title : '公司设置',   //这里用title是因为左侧导航读取了这里的title属性
                icon : 'setting'
            }
        },
    ]
}