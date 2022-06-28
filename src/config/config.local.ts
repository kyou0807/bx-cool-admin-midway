import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';

/**
 * 本地开发 npm run dev 读取的配置文件
 */
export default {
  orm: {
    type: 'mysql',
    host: '42.192.94.104',
    port: 49154,
    username: 'root',
    password: 'kyou0807',
    database: 'kyou',
    // 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失
    synchronize: true,
    // 打印日志
    logging: true,
    // 字符集
    charset: 'utf8mb4',
  },
  midwayLogger: {
    taskLog: {
      disableConsole: true, // 是否禁用打印到控制台，默认禁用
      level: 'warn', // 服务器默认warn
      consoleLevel: 'warn',
    },
  },
  cool: {
    // 是否自动导入数据库
    initDB: true,
  } as CoolConfig,
} as MidwayConfig;
