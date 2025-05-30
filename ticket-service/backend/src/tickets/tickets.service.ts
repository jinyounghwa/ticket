import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { GuestTicketDto } from './dto/guest-ticket.dto';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTicketDto: CreateTicketDto) {
    // 1. 공연 존재 여부 확인
    const event = await this.prisma.event.findUnique({
      where: { id: createTicketDto.eventId },
    });
    
    if (!event) {
      throw new NotFoundException('공연을 찾을 수 없습니다.');
    }

    // 2. 좌석 존재 여부 확인
    const seat = await this.prisma.seat.findUnique({
      where: { 
        id: createTicketDto.seatId,
      },
    });

    if (!seat) {
      throw new NotFoundException('좌석을 찾을 수 없습니다.');
    }

    // 3. 좌석이 이미 예약되었는지 확인
    if (seat.isReserved) {
      throw new ConflictException('이미 예약된 좌석입니다.');
    }

    // 4. 공연 시작 시간이 지났는지 확인
    if (event.startTime < new Date()) {
      throw new BadRequestException('이미 시작된 공연은 예매할 수 없습니다.');
    }

    // 5. 트랜잭션으로 좌석 상태 업데이트 및 티켓 생성
    return this.prisma.$transaction(async (prisma) => {
      // 좌석 상태 업데이트
      await prisma.seat.update({
        where: { id: createTicketDto.seatId },
        data: { isReserved: true },
      });

      // 티켓 생성
      return prisma.ticket.create({
        data: {
          eventId: createTicketDto.eventId,
          seatId: createTicketDto.seatId,
          userId,
          status: TicketStatus.RESERVED,
        },
        include: {
          event: true,
          seat: true,
        },
      });
    });
  }

  async createGuestTicket(guestTicketDto: GuestTicketDto) {
    // 1. 게스트 생성 또는 조회
    let guest = await this.prisma.guest.findFirst({
      where: { email: guestTicketDto.email },
    });

    if (!guest) {
      guest = await this.prisma.guest.create({
        data: {
          email: guestTicketDto.email,
          verificationCode: Math.floor(100000 + Math.random() * 900000).toString(), // 6자리 인증 코드
        },
      });
    }

    // 2. 공연 존재 여부 확인
    const event = await this.prisma.event.findUnique({
      where: { id: guestTicketDto.eventId },
    });
    
    if (!event) {
      throw new NotFoundException('공연을 찾을 수 없습니다.');
    }

    // 3. 좌석 존재 여부 확인
    const seat = await this.prisma.seat.findUnique({
      where: { 
        id: guestTicketDto.seatId,
      },
    });

    if (!seat) {
      throw new NotFoundException('좌석을 찾을 수 없습니다.');
    }

    // 4. 좌석이 이미 예약되었는지 확인
    if (seat.isReserved) {
      throw new ConflictException('이미 예약된 좌석입니다.');
    }

    // 5. 공연 시작 시간이 지났는지 확인
    if (event.startTime < new Date()) {
      throw new BadRequestException('이미 시작된 공연은 예매할 수 없습니다.');
    }

    // 6. 트랜잭션으로 좌석 상태 업데이트 및 티켓 생성
    return this.prisma.$transaction(async (prisma) => {
      // 좌석 상태 업데이트
      await prisma.seat.update({
        where: { id: guestTicketDto.seatId },
        data: { isReserved: true },
      });

      // 티켓 생성
      return prisma.ticket.create({
        data: {
          eventId: guestTicketDto.eventId,
          seatId: guestTicketDto.seatId,
          guestId: guest.id,
          status: TicketStatus.RESERVED,
        },
        include: {
          event: true,
          seat: true,
          guest: true,
        },
      });
    });
  }

  async findUserTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { 
        userId,
        status: {
          not: TicketStatus.REFUNDED,
        } 
      },
      include: {
        event: true,
        seat: true,
      },
      orderBy: {
        reservedAt: 'desc',
      },
    });
  }

  async findGuestTickets(guestId: string) {
    return this.prisma.ticket.findMany({
      where: { 
        guestId,
        status: {
          not: TicketStatus.REFUNDED,
        } 
      },
      include: {
        event: true,
        seat: true,
      },
      orderBy: {
        reservedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        event: true,
        seat: true,
        user: true,
        guest: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('티켓을 찾을 수 없습니다.');
    }

    return ticket;
  }

  async cancelTicket(id: string, userId?: string, guestId?: string) {
    // 1. 티켓 존재 여부 확인
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!ticket) {
      throw new NotFoundException('티켓을 찾을 수 없습니다.');
    }

    // 2. 티켓 소유자 확인
    if (userId && ticket.userId !== userId) {
      throw new BadRequestException('본인의 티켓만 취소할 수 있습니다.');
    }

    if (guestId && ticket.guestId !== guestId) {
      throw new BadRequestException('본인의 티켓만 취소할 수 있습니다.');
    }

    // 3. 티켓 상태 확인
    if (ticket.status !== TicketStatus.RESERVED) {
      throw new BadRequestException('이미 취소되었거나 환불된 티켓입니다.');
    }

    // 4. 공연 시작 시간이 지났는지 확인
    if (ticket.event.startTime < new Date()) {
      throw new BadRequestException('이미 시작된 공연의 티켓은 취소할 수 없습니다.');
    }

    // 5. 트랜잭션으로 좌석 상태 업데이트 및 티켓 상태 변경
    return this.prisma.$transaction(async (prisma) => {
      // 좌석 상태 업데이트
      await prisma.seat.update({
        where: { id: ticket.seatId },
        data: { isReserved: false },
      });

      // 티켓 상태 변경
      return prisma.ticket.update({
        where: { id },
        data: {
          status: TicketStatus.CANCELLED,
          cancelledAt: new Date(),
        },
        include: {
          event: true,
          seat: true,
        },
      });
    });
  }

  async requestRefund(ticketId: string, reason?: string) {
    // 1. 티켓 존재 여부 확인
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('티켓을 찾을 수 없습니다.');
    }

    // 2. 티켓 상태 확인
    if (ticket.status !== TicketStatus.CANCELLED) {
      throw new BadRequestException('취소된 티켓만 환불 요청이 가능합니다.');
    }

    // 3. 이미 환불 요청이 있는지 확인
    const existingRequest = await this.prisma.refundRequest.findFirst({
      where: { ticketId },
    });

    if (existingRequest) {
      throw new ConflictException('이미 환불 요청이 존재합니다.');
    }

    // 4. 환불 요청 생성
    return this.prisma.refundRequest.create({
      data: {
        ticketId,
        reason,
      },
      include: {
        ticket: {
          include: {
            event: true,
          },
        },
      },
    });
  }

  async approveRefund(refundRequestId: string) {
    // 1. 환불 요청 존재 여부 확인
    const refundRequest = await this.prisma.refundRequest.findUnique({
      where: { id: refundRequestId },
      include: { ticket: true },
    });

    if (!refundRequest) {
      throw new NotFoundException('환불 요청을 찾을 수 없습니다.');
    }

    // 2. 이미 승인된 요청인지 확인
    if (refundRequest.approved) {
      throw new BadRequestException('이미 승인된 환불 요청입니다.');
    }

    // 3. 트랜잭션으로 환불 요청 승인 및 티켓 상태 변경
    return this.prisma.$transaction(async (prisma) => {
      // 환불 요청 승인
      await prisma.refundRequest.update({
        where: { id: refundRequestId },
        data: {
          approved: true,
          approvedAt: new Date(),
        },
      });

      // 티켓 상태 변경
      return prisma.ticket.update({
        where: { id: refundRequest.ticketId },
        data: {
          status: TicketStatus.REFUNDED,
          refundedAt: new Date(),
        },
        include: {
          event: true,
          seat: true,
        },
      });
    });
  }
}
