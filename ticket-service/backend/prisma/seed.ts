import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.ticket.deleteMany({});
  await prisma.seat.deleteMany({});
  await prisma.event.deleteMany({});

  console.log('기존 데이터가 삭제되었습니다.');

  // 이벤트 생성
  const events = [
    {
      id: uuidv4(),
      title: '아이유 콘서트 - 더 골든 아워',
      description: '아이유의 새 앨범 발매를 기념하는 특별한 콘서트입니다. 감미로운 목소리로 여러분을 황금빛 시간으로 초대합니다. 히트곡 라이브 무대와 함께 특별한 밤을 선사합니다. 아이유만의 감성으로 가득한 공연을 놓치지 마세요.',
      location: '올림픽 체조경기장',
      startTime: new Date('2025-07-15T18:00:00+09:00'),
      endTime: new Date('2025-07-15T21:00:00+09:00'),
      imageUrl: 'https://i.imgur.com/JY1nxYU.jpg',
      price: 99000,
    },
    {
      id: uuidv4(),
      title: '방탄소년단 월드투어 - 서울 특별공연',
      description: '세계적인 인기를 누리고 있는 방탄소년단의 월드투어 서울 특별공연입니다. 화려한 무대와 함께 잠시도 쉬지 않는 공연을 즐기세요. 전 세계를 강타한 히트곡들과 멤버들의 솔로 무대까지 다양한 퍼포먼스로 가득한 공연입니다. 아미들을 위한 특별한 이벤트도 준비되어 있습니다.',
      location: '잠실 올림픽 주경기장',
      startTime: new Date('2025-09-10T18:00:00+09:00'),
      endTime: new Date('2025-09-10T21:30:00+09:00'),
      imageUrl: 'https://i.imgur.com/8BKI9vw.jpg',
      price: 110000,
    },
    {
      id: uuidv4(),
      title: '클래식 오케스트라 - 베토벤 심포니 전집',
      description: '베토벤의 심포니 전집을 하루에 만나보는 특별한 공연입니다. 세계적인 지휘자와 연주자들이 함께하는 고품격 클래식 공연입니다. 베토벤 탄생 255주년을 기념하는 특별 공연으로, 그의 9개 교향곡을 모두 만나볼 수 있는 귀중한 기회입니다. 클래식 음악의 진수를 경험하세요.',
      location: '예술의전당 콘서트홀',
      startTime: new Date('2025-10-15T19:00:00+09:00'),
      endTime: new Date('2025-10-15T22:00:00+09:00'),
      imageUrl: 'https://i.imgur.com/KZYfXM0.jpg',
      price: 80000,
    },
    {
      id: uuidv4(),
      title: '뮤지컬 오페라 - 레 미제라블',
      description: '세계적인 뮤지컬 오페라 레 미제라블을 한국어 버전으로 만나보세요. 장 발장의 명작을 움직이는 무대와 음악으로 재현합니다. 빅토르 위고의 불멸의 명작이 화려한 무대와 감동적인 음악으로 재탄생합니다. 30주년 기념 특별 공연으로, 새롭게 편곡된 음악과 화려한 무대 연출을 선보입니다.',
      location: '블루스퀘어 인터파크 홀',
      startTime: new Date('2025-11-20T18:30:00+09:00'),
      endTime: new Date('2025-11-20T21:30:00+09:00'),
      imageUrl: 'https://i.imgur.com/V7YYJkS.jpg',
      price: 120000,
    },
    {
      id: uuidv4(),
      title: '뉴진스 팬미팅 - 버니즈 데이',
      description: '인기 걸그룹 뉴진스의 첫 번째 팬미팅입니다. 다양한 게임과 토크, 특별 공연이 준비되어 있습니다. 멤버들과 직접 소통하고 특별한 추억을 만들 수 있는 기회! 팬들을 위한 특별 이벤트와 깜짝 선물도 준비되어 있습니다. 버니즈라면 절대 놓칠 수 없는 특별한 하루가 될 것입니다.',
      location: '고척 스카이돔',
      startTime: new Date('2025-08-05T17:00:00+09:00'),
      endTime: new Date('2025-08-05T20:00:00+09:00'),
      imageUrl: 'https://i.imgur.com/YQtKoMI.jpg',
      price: 88000,
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
      // 좌석 유형에 따라 가격 차등 적용
      let basePrice = event.price;
      if (type === 'VIP') {
        basePrice = event.price * 1.5; // VIP는 1.5배
      } else if (type === 'R') {
        basePrice = event.price * 1.2; // R은 1.2배
      } else if (type === 'S') {
        basePrice = event.price; // S는 기본가
      } else {
        basePrice = event.price * 0.8; // A는 0.8배
      }
      
      for (const row of seatRows) {
        for (let i = 1; i <= seatsPerRow; i++) {
          const seatNumber = `${type}${row}-${i}`;
          // 랜덤하게 일부 좌석은 예약된 상태로 설정
          const isReserved = Math.random() > 0.7;

          await prisma.seat.create({
            data: {
              id: uuidv4(),
              eventId: event.id,
              seatNumber,
              isReserved,
              //price: Math.round(basePrice / 100) * 100, // 100원 단위로 반올림
            },
          });
        }
      }
    }

    console.log(`${event.title}의 좌석이 생성되었습니다.`);
  }

  console.log('시드 데이터가 성공적으로 생성되었습니다.');
}

main()
  .catch((e) => {
    console.error('시드 데이터 생성 중 오류가 발생했습니다:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
