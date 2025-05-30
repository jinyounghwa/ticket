import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class GuestTicketDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: '공연 ID' })
  @IsUUID()
  @IsNotEmpty({ message: '공연 ID는 필수 입력 항목입니다.' })
  eventId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: '좌석 ID' })
  @IsUUID()
  @IsNotEmpty({ message: '좌석 ID는 필수 입력 항목입니다.' })
  seatId: string;

  @ApiProperty({ example: 'guest@example.com', description: '비회원 이메일' })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;
}
