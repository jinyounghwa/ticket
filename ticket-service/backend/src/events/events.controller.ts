import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('이벤트')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '공연 등록', description: '새로운 공연 정보를 등록합니다. (관리자 전용)' })
  @ApiResponse({ status: 201, description: '공연이 성공적으로 등록되었습니다.' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: '공연 목록 조회', description: '모든 공연 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '공연 목록 조회 성공' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '공연 상세 조회', description: '특정 공연의 상세 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '공연 상세 조회 성공' })
  @ApiResponse({ status: 404, description: '공연을 찾을 수 없습니다.' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '공연 수정', description: '공연 정보를 수정합니다. (관리자 전용)' })
  @ApiResponse({ status: 200, description: '공연 정보가 성공적으로 수정되었습니다.' })
  @ApiResponse({ status: 404, description: '공연을 찾을 수 없습니다.' })
  update(@Param('id') id: string, @Body() updateEventDto: CreateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '공연 삭제', description: '공연 정보를 삭제합니다. (관리자 전용)' })
  @ApiResponse({ status: 200, description: '공연이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '공연을 찾을 수 없습니다.' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Get(':id/seats')
  @ApiOperation({ summary: '공연 좌석 조회', description: '특정 공연의 좌석 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '공연 좌석 조회 성공' })
  @ApiResponse({ status: 404, description: '공연을 찾을 수 없습니다.' })
  async getSeats(@Param('id') id: string) {
    return this.eventsService.getSeats(id);
  }
}
