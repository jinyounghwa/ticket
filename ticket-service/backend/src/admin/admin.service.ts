import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Prisma에서 생성된 TicketStatus enum이 없는 경우를 대비해 직접 정의
enum TicketStatus {
  RESERVED = 'RESERVED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllTickets(page = 1, limit = 10, status?: TicketStatus) {
    const skip = (page - 1) * limit;
    
    const where = status ? { status } : {};
    
    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        include: {
          event: true,
          seat: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          guest: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: {
          reservedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return {
      tickets,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEventStatistics(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return null;
    }

    const [reserved, cancelled, refunded] = await Promise.all([
      this.prisma.ticket.count({
        where: {
          eventId,
          status: TicketStatus.RESERVED,
        },
      }),
      this.prisma.ticket.count({
        where: {
          eventId,
          status: TicketStatus.CANCELLED,
        },
      }),
      this.prisma.ticket.count({
        where: {
          eventId,
          status: TicketStatus.REFUNDED,
        },
      }),
    ]);

    const totalSeats = await this.prisma.seat.count({
      where: { eventId },
    });

    const reservedSeats = await this.prisma.seat.count({
      where: {
        eventId,
        isReserved: true,
      },
    });

    return {
      event,
      statistics: {
        totalSeats,
        availableSeats: totalSeats - reservedSeats,
        reservedTickets: reserved,
        cancelledTickets: cancelled,
        refundedTickets: refunded,
        totalTickets: reserved + cancelled + refunded,
        occupancyRate: totalSeats > 0 ? (reservedSeats / totalSeats) * 100 : 0,
      },
    };
  }

  async getAllStatistics() {
    const events = await this.prisma.event.findMany({
      orderBy: {
        startTime: 'asc',
      },
    });

    const statistics = await Promise.all(
      events.map(async (event) => {
        const stats = await this.getEventStatistics(event.id);
        return stats.statistics;
      }),
    );

    const totalReserved = statistics.reduce(
      (sum, stat) => sum + stat.reservedTickets,
      0,
    );
    const totalCancelled = statistics.reduce(
      (sum, stat) => sum + stat.cancelledTickets,
      0,
    );
    const totalRefunded = statistics.reduce(
      (sum, stat) => sum + stat.refundedTickets,
      0,
    );
    const totalTickets = totalReserved + totalCancelled + totalRefunded;

    return {
      events: events.map((event, index) => ({
        event,
        statistics: statistics[index],
      })),
      summary: {
        totalEvents: events.length,
        totalReservedTickets: totalReserved,
        totalCancelledTickets: totalCancelled,
        totalRefundedTickets: totalRefunded,
        totalTickets,
        cancellationRate: totalTickets > 0 ? (totalCancelled / totalTickets) * 100 : 0,
        refundRate: totalCancelled > 0 ? (totalRefunded / totalCancelled) * 100 : 0,
      },
    };
  }

  async getPendingRefundRequests() {
    return this.prisma.refundRequest.findMany({
      where: {
        approved: false,
      },
      include: {
        ticket: {
          include: {
            event: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
            guest: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        requestedAt: 'asc',
      },
    });
  }
}
