import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('기본')
@Controller()
export class AppController {
  @Get()
  @Redirect('/api')
  @ApiOperation({ summary: 'API 문서로 리다이렉트', description: 'Swagger API 문서 페이지로 리다이렉트합니다.' })
  redirectToApiDocs() {
    return { url: '/api' };
  }
}
