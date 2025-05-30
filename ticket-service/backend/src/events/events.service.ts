import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        title: createEventDto.title,
        description: createEventDto.description,
        location: createEventDto.location,
        startTime: new Date(createEventDto.startTime),
        endTime: new Date(createEventDto.endTime),
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        seats: true,
      },
    });

    if (!event) {
      throw new NotFoundException('공연을 찾을 수 없습니다.');
    }

    return event;
  }

  async update(id: string, updateEventDto: CreateEventDto) {
    try {
      return await this.prisma.event.update({
        where: { id },
        data: {
          title: updateEventDto.title,
          description: updateEventDto.description,
          location: updateEventDto.location,
          startTime: new Date(updateEventDto.startTime),
          endTime: new Date(updateEventDto.endTime),
        },
      });
    } catch (error) {
      throw new NotFoundException('공연을 찾을 수 없습니다.');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('공연을 찾을 수 없습니다.');
    }
  }
}
