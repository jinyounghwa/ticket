import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: '2023 여름 콘서트', description: '공연 제목' })
  @IsString()
  @IsNotEmpty({ message: '공연 제목은 필수 입력 항목입니다.' })
  title: string;

  @ApiProperty({ example: '여름을 맞이하는 특별한 콘서트', description: '공연 설명' })
  @IsString()
  @IsNotEmpty({ message: '공연 설명은 필수 입력 항목입니다.' })
  description: string;

  @ApiProperty({ example: '서울 올림픽 공원', description: '공연 장소' })
  @IsString()
  @IsNotEmpty({ message: '공연 장소는 필수 입력 항목입니다.' })
  location: string;

  @ApiProperty({ example: '2023-07-15T18:00:00Z', description: '공연 시작 시간' })
  @IsDateString()
  @IsNotEmpty({ message: '공연 시작 시간은 필수 입력 항목입니다.' })
  startTime: string;

  @ApiProperty({ example: '2023-07-15T21:00:00Z', description: '공연 종료 시간' })
  @IsDateString()
  @IsNotEmpty({ message: '공연 종료 시간은 필수 입력 항목입니다.' })
  endTime: string;
}
