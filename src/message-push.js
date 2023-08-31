// 推送钉钉消息

import request from 'request';
import crypto from 'crypto';
import config from '../config.js';

function pushDingDing(title, text) {
    const data = {
        msgtype: 'markdown',
        markdown: {
            title: title,
            text: text,
        },
        at: {
            isAtAll: false,
        },
    };

    return new Promise(function (resolve, reject) {
        request(
            {
                url: getSignUrl(),
                method: 'post',
                json: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
            },
            function (error, response, body) {
                console.log(body);
                if (!error && response.statusCode === 200) {
                    resolve();
                } else {
                    reject();
                }
            }
        );
    });
}

function getSignUrl() {
    const time = new Date().getTime();
    const stringToSign = time + '\n' + config.dingdingSecret;
    const base = crypto.createHmac('sha256', config.dingdingSecret).update(stringToSign).digest('base64');
    const sign = encodeURIComponent(base);
    const url = config.dingdingWebhook + `&timestamp=${time}&sign=${sign}`;

    return url;
}

export { pushDingDing };
