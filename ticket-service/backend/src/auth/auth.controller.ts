import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '새로운 사용자를 등록합니다.' })
  @ApiResponse({ status: 201, description: '사용자가 성공적으로 등록되었습니다.' })
  @ApiResponse({ status: 409, description: '이미 등록된 이메일입니다.' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인', description: '사용자 인증 및 토큰 발급' })
  @ApiResponse({ status: 200, description: '로그인 성공 및 토큰 발급' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
