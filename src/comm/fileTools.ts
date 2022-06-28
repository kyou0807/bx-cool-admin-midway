/*
 * @Description:文件操作类
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-05-04 15:23:46
 * @LastEditTime: 2022-06-28 14:19:14
 */
const fs = require('fs');
const path = require('path');
let archiver = require('archiver');
// const encrypted = require('archiver-zip-encrypted');
import { ILogger } from '@midwayjs/logger';

import { Inject, Logger, Provide } from '@midwayjs/decorator';

@Provide()
export class FileTools {
  @Inject()
  baseDir;

  @Logger()
  logger: ILogger;

  folderExists(path: string): boolean {
    return fs.existsSync(path);
  }

  /**
   * @description: 根据路径创建文件夹,如果存在,就不创建
   * @param {*} path
   * @return {*}
   * @author: 池樱千幻
   */
  createdFolder(FolderPath) {
    try {
      if (!fs.existsSync(path.join(this.baseDir, '../', FolderPath))) {
        this.logger.info('文件夹不存在!');
        fs.mkdirSync(path.join(this.baseDir, '../', FolderPath));
        this.logger.info(`创建${FolderPath}成功!`);
      } else {
        this.logger.info('文件夹已存在!');
      }
    } catch (error) {
      this.logger.info(error);
    }
  }

  /**
   * @description: 文件大小格式化
   * @param {*} limit
   * @return {*}
   * @author: 池樱千幻
   */
  fileSizeFormat(limit) {
    let size = '';
    if (limit < 0.1 * 1024) {
      //小于0.1KB，则转化成B
      size = limit.toFixed(2) + 'B';
    } else if (limit < 0.1 * 1024 * 1024) {
      //小于0.1MB，则转化成KB
      size = (limit / 1024).toFixed(2) + 'KB';
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {
      //小于0.1GB，则转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
    } else {
      //其他转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
    }
    let sizeStr = size + ''; //转成字符串
    let index = sizeStr.indexOf('.'); //获取小数点处的索引
    let dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
    if (dou == '00') {
      //判断后两位是否为00，如果是则删除00
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
    }
    return size;
  }

  /**
   * @description: 压缩文件
   * @param {*} targetFilePath 目标文件夹
   * @param {*} outFilePath 输出文件
   * @return {*}
   * @author: 池樱千幻
   */
  zipFile(targetFilePath, outFilePath) {
    console.log('targetFilePath: ', targetFilePath, outFilePath);
    return new Promise((resolve, reject) => {
      // 创建文件输出流
      let output = fs.createWriteStream(outFilePath);
      // archiver.registerFormat('zip-encrypted', encrypted);
      let archive = archiver('zip', {
        zlib: { level: 9 }, // 设置压缩级别
        encryptionMethod: 'aes256',

        // password: `76170C8E530D2E9A6814FBB24FFBCED8${appid}`
      });
      // 文件输出流结束
      output.on('close', () => {
        this.logger.info(
          `压缩包大小 ${this.fileSizeFormat(archive.pointer())}`
        );
        resolve(true);
      });
      // 通过管道方法将输出流存档到文件
      archive.pipe(output);
      const baseFilePath = targetFilePath + '/';
      const filedirs = fs.readdirSync(baseFilePath);
      filedirs.forEach(filename => {
        let filedir = baseFilePath + filename;
        const stat = fs.statSync(filedir);
        if (stat.isDirectory()) {
          archive.directory(filedir, filename);
        } else {
          archive.append(fs.createReadStream(filedir), { name: filename });
        }
      });
      // 完成归档
      archive.finalize();
    });
  }
}
