// 本地持久化存储IP

import fs from "fs";
import readline from "readline";

const logFile = "log.txt";

/**
 * 写入日志
 * @param { ip: x.x.x.x, time:'xxxx年xx月xx日 星期x xx:xx', msg:'注释' } content
 */
export function writeLog(content) {
  const writeString = `${content.ip}/${content.time}/${content.msg}\n`;
  fs.writeFileSync(logFile, writeString, { flag: "a" }, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

/**
 * 读取日志
 * @returns Object {ip: x.x.x.x, time:'xxxx年xx月xx日', msg:'注释'}
 */
export function readLog() {
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lastLine;

  rl.on("line", (line) => {
    lastLine = line;
  });

  return new Promise((resolve, reject) => {
    rl.on("close", () => {
      if (lastLine) {
        const dataArr = lastLine.split("/");
        const dataObj = {
          ip: dataArr[0],
          time: dataArr[1],
          msg: dataArr[2],
        };
        resolve(dataObj);
      } else {
        reject("未读取到数据");
      }
    });
  });
}
