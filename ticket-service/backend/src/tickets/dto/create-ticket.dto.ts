import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: '공연 ID' })
  @IsUUID()
  @IsNotEmpty({ message: '공연 ID는 필수 입력 항목입니다.' })
  eventId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: '좌석 ID' })
  @IsUUID()
  @IsNotEmpty({ message: '좌석 ID는 필수 입력 항목입니다.' })
  seatId: string;
}
