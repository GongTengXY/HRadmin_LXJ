//公司设置的相关接口
import request from '@/utils/request'

//获取所有角色列表
export const getRoleList = (params) => request({
    method : 'get',
    url : '/sys/role',
    params,
})

//根据公司id获取公司详情
export const getCompanyDetails = (companyId) => request({
    method : 'get',
    url : `/company/${companyId}`
})

//删除id角色
export const deleteRole = (id) => request({
    method : 'delete',
    url : `/sys/role/${id}`
})

//编辑更新id角色信息
export const editRoleInfo = data => request({
    method : 'put',
    url : `/sys/role/${data.id}`,
    data,
})

//根据角色id获取详情
export const editRole = id => request({
    method : 'get',
    url : `/sys/role/${id}`,
})

//增加角色
export const addRole = data => request({
    method : 'post',
    url : `/sys/role`,
    data,
})