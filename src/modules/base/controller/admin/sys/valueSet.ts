/*
 * @Description:
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-20 17:18:13
 * @LastEditTime: 2022-04-21 15:47:20
 */
/*
 * @Description:值集查询
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-20 17:14:09
 * @LastEditTime: 2022-04-20 17:15:16
 */
import { Provide, Post, Inject, Body } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { valueSetEntity } from '../../../entity/sys/value_set';
import { ValueSetService } from '../../../service/sys/valueSet';

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

  @Post('/getValueSetRoot')
  async getValueSetRoot(@Body('pid') pid: number) {
    return this.ok(await this.valueSetService.getValueSetRoot({ pid }));
  }
}
