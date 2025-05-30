import { Controller, Get, Post, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { GuestTicketDto } from './dto/guest-ticket.dto';
import { CancelTicketDto } from './dto/cancel-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

// Express의 Request 타입에 user 속성을 추가하기 위한 확장 타입
interface RequestWithUser extends ExpressRequest {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('티켓')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '티켓 예매', description: '회원 티켓 예매' })
  @ApiResponse({ status: 201, description: '티켓 예매 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '공연 또는 좌석을 찾을 수 없습니다.' })
  @ApiResponse({ status: 409, description: '이미 예약된 좌석입니다.' })
  async create(@Body() createTicketDto: CreateTicketDto, @Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return this.ticketsService.create(userId, createTicketDto);
  }

  @Post('guest')
  @ApiOperation({ summary: '비회원 티켓 예매', description: '비회원 티켓 예매' })
  @ApiResponse({ status: 201, description: '티켓 예매 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '공연 또는 좌석을 찾을 수 없습니다.' })
  @ApiResponse({ status: 409, description: '이미 예약된 좌석입니다.' })
  async createGuestTicket(@Body() guestTicketDto: GuestTicketDto) {
    return this.ticketsService.createGuestTicket(guestTicketDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 티켓 조회', description: '회원의 티켓 목록 조회' })
  @ApiResponse({ status: 200, description: '티켓 조회 성공' })
  async findUserTickets(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return this.ticketsService.findUserTickets(userId);
  }

  @Get('guest/:guestId')
  @ApiOperation({ summary: '비회원 티켓 조회', description: '비회원의 티켓 목록 조회' })
  @ApiResponse({ status: 200, description: '티켓 조회 성공' })
  async findGuestTickets(@Param('guestId') guestId: string) {
    return this.ticketsService.findGuestTickets(guestId);
  }

  @Get(':id')
  @ApiOperation({ summary: '티켓 상세 조회', description: '특정 티켓의 상세 정보 조회' })
  @ApiResponse({ status: 200, description: '티켓 조회 성공' })
  @ApiResponse({ status: 404, description: '티켓을 찾을 수 없습니다.' })
  async findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '티켓 취소', description: '회원 티켓 취소' })
  @ApiResponse({ status: 200, description: '티켓 취소 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '티켓을 찾을 수 없습니다.' })
  async cancelTicket(@Body() cancelTicketDto: CancelTicketDto, @Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return this.ticketsService.cancelTicket(cancelTicketDto.ticketId, userId);
  }

  @Post('guest/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '비회원 티켓 취소', description: '비회원 티켓 취소' })
  @ApiResponse({ status: 200, description: '티켓 취소 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '티켓을 찾을 수 없습니다.' })
  async cancelGuestTicket(
    @Body() cancelTicketDto: CancelTicketDto,
    @Body('guestId') guestId: string,
  ) {
    return this.ticketsService.cancelTicket(cancelTicketDto.ticketId, undefined, guestId);
  }

  @Post('refund/:ticketId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '환불 요청', description: '취소된 티켓에 대한 환불 요청' })
  @ApiResponse({ status: 201, description: '환불 요청 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '티켓을 찾을 수 없습니다.' })
  @ApiResponse({ status: 409, description: '이미 환불 요청이 존재합니다.' })
  async requestRefund(
    @Param('ticketId') ticketId: string,
    @Body('reason') reason?: string,
  ) {
    return this.ticketsService.requestRefund(ticketId, reason);
  }

  @Post('refund/approve/:refundRequestId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '환불 승인', description: '환불 요청 승인 (관리자 전용)' })
  @ApiResponse({ status: 200, description: '환불 승인 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '환불 요청을 찾을 수 없습니다.' })
  async approveRefund(@Param('refundRequestId') refundRequestId: string) {
    return this.ticketsService.approveRefund(refundRequestId);
  }
}
