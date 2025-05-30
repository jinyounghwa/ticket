import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

// Prisma에서 생성된 TicketStatus enum이 없는 경우를 대비해 직접 정의
enum TicketStatus {
  RESERVED = 'RESERVED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

@ApiTags('관리자')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('tickets')
  @ApiOperation({ summary: '모든 티켓 조회', description: '모든 티켓 목록을 조회합니다. (관리자 전용)' })
  @ApiResponse({ status: 200, description: '티켓 목록 조회 성공' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '페이지당 항목 수' })
  @ApiQuery({ name: 'status', required: false, enum: TicketStatus, description: '티켓 상태 필터' })
  async getAllTickets(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: TicketStatus,
  ) {
    return this.adminService.getAllTickets(page, limit, status);
  }

  @Get('statistics/event/:id')
  @ApiOperation({ summary: '공연별 통계', description: '특정 공연의 예매 통계를 조회합니다. (관리자 전용)' })
  @ApiResponse({ status: 200, description: '통계 조회 성공' })
  async getEventStatistics(@Param('id') id: string) {
    return this.adminService.getEventStatistics(id);
  }

  @Get('statistics')
  @ApiOperation({ summary: '전체 통계', description: '모든 공연의 예매 통계를 조회합니다. (관리자 전용)' })
  @ApiResponse({ status: 200, description: '통계 조회 성공' })
  async getAllStatistics() {
    return this.adminService.getAllStatistics();
  }

  @Get('refund-requests')
  @ApiOperation({ summary: '환불 요청 목록', description: '승인 대기 중인 환불 요청 목록을 조회합니다. (관리자 전용)' })
  @ApiResponse({ status: 200, description: '환불 요청 목록 조회 성공' })
  async getPendingRefundRequests() {
    return this.adminService.getPendingRefundRequests();
  }
}
