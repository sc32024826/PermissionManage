import request from '@/libs/api.request'
import axios from 'axios'

export const login = ({ userName, password }) => {
    const data = {
        name: userName,
        pass: password
    }
    return axios({
        url: 'http://localhost:8081/api/Login/JWTToken3.0',
        params: data,
        method: 'GET'
    })
}

export const getUserInfo = () => {
    return {
        Avatar: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png',
        UserName: 'super_admin',
        UserId: '1',
        Access: ['super_admin', 'admin']
    }
}

export const logout = (token) => {
    return request({
        url: 'logout',
        method: 'post'
    })
}

export const getUnreadCount = () => {
    return request({
        url: 'message/count',
        method: 'get'
    })
}

export const getMessage = () => {
    return request({
        url: 'message/init',
        method: 'get'
    })
}

export const getContentByMsgId = msg_id => {
    return request({
        url: 'message/content',
        method: 'get',
        params: {
            msg_id
        }
    })
}

export const hasRead = msg_id => {
    return request({
        url: 'message/has_read',
        method: 'post',
        data: {
            msg_id
        }
    })
}

export const removeReaded = msg_id => {
    return request({
        url: 'message/remove_readed',
        method: 'post',
        data: {
            msg_id
        }
    })
}

export const restoreTrash = msg_id => {
    return request({
        url: 'message/restore',
        method: 'post',
        data: {
            msg_id
        }
    })
}
