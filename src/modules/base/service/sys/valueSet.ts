/*
 * @Description:值集服务
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-21 15:24:45
 * @LastEditTime: 2022-04-21 17:34:05
 */
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { valueSetEntity } from '../../entity/sys/value_set';

/**
 * 描述
 */
@Provide()
export class ValueSetService extends BaseService {
  @InjectEntityModel(valueSetEntity)
  valueSetEntity: Repository<valueSetEntity>;

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

  async getValueSetByEname(query) {
    let { ename } = query;
    let enameList = await this.valueSetEntity.find({ ename });
    const childList = await this.nativeQuery(
      'select * from value_set a where pid in (?)',
      [enameList.map(item => item.id)]
    );
    return [...enameList, ...childList];
  }
}
