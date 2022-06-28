/*
 * @Description:值集查询
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-20 17:14:09
 * @LastEditTime: 2022-06-21 17:29:55
 */
import {
  Provide,
  Post,
  Inject,
  Body,
  App,
  MidwayFrameworkType,
} from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { valueSetEntity } from '../../../entity/sys/value_set';
import { ValueSetService } from '../../../service/sys/valueSet';
import { Application as SocketApplication } from '@midwayjs/socketio';
import { socketType } from '../../../../../socket/socketType';

/**
 * 描述
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: valueSetEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.ename', 'a.cname', 'a.pid'],
  },
})
export class valueSetAdminController extends BaseController {
  @Inject()
  valueSetService: ValueSetService;

  @App(MidwayFrameworkType.WS_IO)
  socketApp: SocketApplication;

  @Post('/getValueSetRoot')
  async getValueSetRoot(@Body('pid') pid: number) {
    return this.ok(await this.valueSetService.getValueSetRoot({ pid }));
  }

  @Post('/getValueSetByEname', { summary: '根据ename获取值集' })
  async getValueSetByEname(@Body('ename') ename: string) {
    let list = await this.valueSetService.getValueSetByEname({ ename });
    return this.ok(list);
  }
}
