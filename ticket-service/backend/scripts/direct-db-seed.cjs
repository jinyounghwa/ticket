// 직접 데이터베이스에 이벤트와 좌석 추가하는 스크립트
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // 기존 데이터 삭제
    console.log('기존 데이터 삭제 중...');
    await prisma.ticket.deleteMany({});
    await prisma.seat.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('기존 데이터 삭제 완료');

    // 관리자 계정 추가
    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin1234';
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log('관리자 계정(admin@admin.com / admin1234)이 생성되었습니다.');

    // 이벤트 데이터
    const events = [
      {
        title: '아이유 콘서트 - 더 골든 아워',
        description: '아이유의 새 앨범 발매를 기념하는 특별한 콘서트입니다. 감미로운 목소리로 여러분을 황금빛 시간으로 초대합니다.',
        location: '올림픽 체조경기장',
        startTime: new Date('2025-07-15T18:00:00+09:00'),
        endTime: new Date('2025-07-15T21:00:00+09:00'),
      },
      {
        title: '방탄소년단 월드투어 - 서울 특별공연',
        description: '세계적인 인기를 누리고 있는 방탄소년단의 월드투어 서울 특별공연입니다. 화려한 무대와 함께 잠시도 쉬지 않는 공연을 즐기세요.',
        location: '잠실 올림픽 주경기장',
        startTime: new Date('2025-09-10T18:00:00+09:00'),
        endTime: new Date('2025-09-10T21:30:00+09:00'),
      },
      {
        title: '클래식 오케스트라 - 베토벤 심포니 전집',
        description: '베토벤의 심포니 전집을 하루에 만나보는 특별한 공연입니다. 세계적인 지휘자와 연주자들이 함께하는 고품격 클래식 공연입니다.',
        location: '예술의전당 콘서트홀',
        startTime: new Date('2025-10-15T19:00:00+09:00'),
        endTime: new Date('2025-10-15T22:00:00+09:00'),
      },
      {
        title: '뮤지컬 오페라 - 레 미제라블',
        description: '세계적인 뮤지컬 오페라 레 미제라블을 한국어 버전으로 만나보세요. 장 발장의 명작을 움직이는 무대와 음악으로 재현합니다.',
        location: '블루스퀘어 인터파크 홀',
        startTime: new Date('2025-11-20T18:30:00+09:00'),
        endTime: new Date('2025-11-20T21:30:00+09:00'),
      },
      {
        title: '뉴진스 팬미팅 - 버니즈 데이',
        description: '인기 걸그룹 뉴진스의 첫 번째 팬미팅입니다. 다양한 게임과 토크, 특별 공연이 준비되어 있습니다.',
        location: '고척 스카이돔',
        startTime: new Date('2025-08-05T17:00:00+09:00'),
        endTime: new Date('2025-08-05T20:00:00+09:00'),
      },
    ];

    // 이벤트 및 좌석 생성
    for (const eventData of events) {
      const event = await prisma.event.create({
        data: eventData,
      });

      console.log(`이벤트가 생성되었습니다: ${event.title}`);

      // 좌석 생성 (각 이벤트마다 다른 좌석 구성)
      const seatTypes = ['VIP', 'R', 'S', 'A'];
      const seatRows = ['1', '2', '3'];
      const seatsPerRow = 5;

      for (const type of seatTypes) {
        for (const row of seatRows) {
          for (let i = 1; i <= seatsPerRow; i++) {
            const seatNumber = `${type}${row}-${i}`;
            // 랜덤하게 일부 좌석은 예약된 상태로 설정
            const isReserved = Math.random() > 0.7;

            await prisma.seat.create({
              data: {
                eventId: event.id,
                seatNumber,
                isReserved,
              },
            });
          }
        }
      }

      console.log(`${event.title}의 좌석이 생성되었습니다.`);
    }

    console.log('시드 데이터가 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('시드 데이터 생성 중 오류가 발생했습니다:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
