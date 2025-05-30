import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CancelTicketDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: '티켓 ID' })
  @IsUUID()
  @IsNotEmpty({ message: '티켓 ID는 필수 입력 항목입니다.' })
  ticketId: string;

  @ApiProperty({ example: '취소 사유', description: '취소 사유 (선택 사항)', required: false })
  reason?: string;
}
