/*
 * @Description:值集服务
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-21 15:24:45
 * @LastEditTime: 2022-06-20 13:39:27
 */
import { Provide, Inject } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { valueSetEntity } from '../../entity/sys/value_set';
import { Utils } from '../../../../comm/utils';
import { CoolCache } from '@cool-midway/core';
/**
 * 描述
 */
@Provide()
export class ValueSetService extends BaseService {
  @InjectEntityModel(valueSetEntity)
  valueSetEntity: Repository<valueSetEntity>;

  @Inject()
  utils: Utils;

  //方法缓存,30s内如果再次请求,就会读redis里的缓存数据
  @CoolCache(30)
  async getValueSetRoot(query) {
    let { pid } = query;
    let list = await this.valueSetEntity.find({ pid });
    return list.map(item => {
      return {
        value: item.id,
        label: `${item.cname}(${item.ename})-${item.title}`,
      };
    });
  }

  @CoolCache(30)
  async getValueSetByEname(query) {
    let { ename } = query;
    let enameList = await this.valueSetEntity.find({ ename });
    if (enameList.length == 0) {
      return [];
    }
    const childList = await this.nativeQuery(
      'select * from value_set a where pid in (?)',
      [enameList.map(item => item.id)]
    );
    return this.utils.getTree(
      [...enameList, ...childList].map(item => {
        delete item.createTime;
        delete item.updateTime;
        return item;
      })
    );
  }
}
