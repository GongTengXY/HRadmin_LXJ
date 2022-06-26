//员工的路由规则
import Layout from '@/layout'

export default {
    //路由规则
    path : '/employees',
    name : 'employees',   //后面做权限的时候会用到
    component : Layout,
    children : [
        {
            //二级路由的path什么都不用写的时候，此时它表示二级路由默认路由
            path : '',   //这里不用写，则表示 /employees 不但有布局layou还有下面这个员工主页的路由
            component : () => import('@/views/employees'),
            //路由元信息
            meta : {
                title : '员工管理',   //这里用title是因为左侧导航读取了这里的title属性
                icon : 'people'
            }
        },
        {
            //员工信息详情页
            path : 'detail/:id',  //给id后面加？为参数可传可不传
            component : () => import('@/views/employees/detail'),
            hidden : true, //不在左侧菜单显示
            meta : {
                title : '员工详情'
            }
        },
        {
            //员工打印页
            path : 'print/:id',
            component : () => import('@/views/employees/print'),
            hidden : true,
            meta : {
                title : '员工打印'
            }
        }
    ]
}