import { publicIpv4 } from 'public-ip';
import dayjs from 'dayjs';
import schedule from 'node-schedule';
import { pushDingDing } from './message-push.js';
import reqHeartBeat from './heartbeats.js';

let globalIp = '';
let ipChangeCount = 0;
let globalCheckStatus = true;
let globalDay = new Date().getDay();

monitorIP();

schedule.scheduleJob('*/20 * * * *', async () => {
    monitorIP();
});

async function monitorIP() {
    let today = dayjs().format('YYYY年MM月DD日');
    let hour = dayjs().format('HH:mm');
    let weekArray = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    let week = weekArray[dayjs().day()];

    let currentDay = new Date().getDay();

    if (ipChangeCount >= 5) {
        if (currentDay === globalDay) {
            // 当天IP地址变动超过5次
            if (!globalCheckStatus) {
                return;
            }
            globalCheckStatus = false;

            console.log('今日IP地址变动超过5次，停止监控ip');
            await pushDingDing('公司电脑IP监控', `### ${today} ${week} ${hour} \n ### 今日IP地址变动超过5次，停止监控ip`);

            return;
        } else {
            // 第二天重置日期、变动次数、监控状态、全局IP
            globalDay = currentDay;
            ipChangeCount = 0;
            globalCheckStatus = true;
            globalIp = '';

            console.log('重置日期、变动次数、监控状态、全局IP');
        }
    }

    console.time('获取ip花费时间');
    let currentIp = await publicIpv4();

    reqHeartBeat();

    // 启动脚本时发送ip
    if (globalIp === '') {
        globalIp = currentIp;
        globalDay = currentDay;

        console.log(`${today} ${week} ${hour} 启动公司电脑IP监控`);
        await pushDingDing('公司电脑IP监控', `### ${today} ${week} ${hour} \n ### 启动公司电脑IP监控 \n ### 当前IP：${currentIp}`);

        console.timeEnd('获取ip花费时间');
        return;
    }

    if (globalIp !== currentIp) {
        console.log(`${today} ${week} ${hour} ip 变动，旧 ip ${globalIp}，新 ip ${currentIp}`);
        await pushDingDing('公司电脑IP监控', `### ${today} ${week} ${hour} \n ### 监控到公司电脑IP变化 \n ### 旧IP：${globalIp}\n ### 新IP：${currentIp}`);

        globalIp = currentIp;
        ipChangeCount++;
    } else {
        console.log(`${today} ${week} ${hour} ip 未变动，当前 ip ${currentIp}`);
    }
    console.timeEnd('获取ip花费时间');
}


