// import axios from 'axios'
const axios = require('axios')

function test () {
    axios({
        url: 'https://protal.servers.mchains.cn/connect/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
            client_id: 'postman',
            client_secret: '1a0b1ef4-4305-adeb-b081-00463218086e',
            grant_type: 'password',
            username: 'test',
            password: 'Sy@123'
        }
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}
test()
