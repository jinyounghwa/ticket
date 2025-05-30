import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// 상대 경로로 모듈 가져오기
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS 설정
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  
  // 전역 파이프 설정 (DTO 검증)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger 문서 설정
  const config = new DocumentBuilder()
    .setTitle('티켓 예매 서비스 API')
    .setDescription('티켓 예매 서비스를 위한 REST API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // AppController에서 리다이렉트 처리

  const port = process.env.PORT || 4001;
  await app.listen(port);
  console.log(`애플리케이션이 http://localhost:${port} 에서 실행 중입니다.`);
}
bootstrap();
