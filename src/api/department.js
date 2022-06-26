// 组织架构的接口封装
import request from '@/utils/request'

//获取企业的部门列表
export const getDepartment = () => request({
    url : '/company/department',
    method : 'get'
})

//删除部门
export const delDepartments = id => request({
    url : `/company/department/${id}`,
    method : 'DELETE'          //接口满足restful接口规范
    // 同样的地址 不同的方法 执行不同的业务
    // delete 删除业务
    // get 获取业务
    // post 新增或者添加业务
    // put 修改业务
})

//添加部门
export const addDepartments = data => request({
    url : '/company/department',
    method : 'post',
    data,
})

//获取部门详情
export const getDepartDetail = (id) => request({
    url : `/company/department/${id}`,
    method : 'get'
})

//修改部门信息
export const editDepartDetail = (data) => request({
    url : `/company/department/${data.id}`,
    method : 'put',
    data
})