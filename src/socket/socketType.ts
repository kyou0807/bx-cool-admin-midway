export enum socketType {
  task = 'task', // 任务类型
  notice = 'notice', //通知
  success = 'success', // 连接成功
  client = 'client', // 客户端消息
  close = 'close', // 服务端主动关闭
  logout = 'logout', // 登出
  build_project_success = 'build_project_success', // 打包成功
}
