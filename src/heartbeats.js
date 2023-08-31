// 心跳服务

import axios from 'axios';
import config from '../config.js';

function reqHeartBeat() {
    axios
        .get(config.butterUptimeHeartbeats)
        .then(function (data) {
            console.log('请求心跳服务器成功');
        })
        .catch(function (err) {
            console.log('请求心跳服务器失败');
        });
}

export default reqHeartBeat;
