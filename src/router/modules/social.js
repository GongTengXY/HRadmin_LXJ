//员工的路由规则
import Layout from '@/layout'

export default {
    //路由规则
    path : '/social',
    name : 'social',   //后面做权限的时候会用到
    component : Layout,
    children : [
        {
            //二级路由的path什么都不用写的时候，此时它表示二级路由默认路由
            path : '',  
            component : () => import('@/views/social'),
            //路由元信息
            meta : {
                title : '社保',   //这里用title是因为左侧导航读取了这里的title属性
                icon : 'table'
            }
        },
    ]
}