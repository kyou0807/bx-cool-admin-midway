import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 登录参数校验
 */
export class LoginDTO {
  // 用户名
  @ApiProperty({ example: 'kyou', description: '用户名' })
  @Rule(RuleType.string().required())
  username: string;

  // 密码
  @ApiProperty({ example: '123456', description: '密码' })
  @Rule(RuleType.string().required())
  password: string;

  // 验证码ID
  @ApiProperty({ description: '验证码ID' })
  @Rule(RuleType.string().required())
  captchaId: string;

  // 验证码
  @ApiProperty({ description: '验证码' })
  @Rule(RuleType.required())
  verifyCode: number;
}
