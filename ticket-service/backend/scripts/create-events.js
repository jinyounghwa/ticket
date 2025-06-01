// 이벤트 생성 스크립트
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';
let authToken = '';

// 관리자 로그인 함수
async function loginAsAdmin() {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123',
      }),
    });

    if (!response.ok) {
      throw new Error(`로그인 실패: ${response.status}`);
    }

    const data = await response.json();
    authToken = data.access_token;
    console.log('관리자 로그인 성공!');
    return authToken;
  } catch (error) {
    console.error('로그인 오류:', error.message);
    // 계정이 없으면 회원가입 시도
    await registerAdmin();
  }
}

// 관리자 계정 생성 함수
async function registerAdmin() {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123',
        role: 'ADMIN',
      }),
    });

    if (!response.ok) {
      throw new Error(`회원가입 실패: ${response.status}`);
    }

    console.log('관리자 계정 생성 성공!');
    await loginAsAdmin();
  } catch (error) {
    console.error('회원가입 오류:', error.message);
  }
}

// 이벤트 생성 함수
async function createEvent(eventData) {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`이벤트 생성 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log(`이벤트 생성 성공: ${eventData.title}`);
    return data;
  } catch (error) {
    console.error('이벤트 생성 오류:', error.message);
  }
}

// 좌석 생성 함수
async function createSeats(eventId, seatCount = 60) {
  try {
    const seatTypes = ['VIP', 'R', 'S', 'A'];
    const seatRows = ['1', '2', '3'];
    const seatsPerRow = 5;
    
    for (const type of seatTypes) {
      for (const row of seatRows) {
        for (let i = 1; i <= seatsPerRow; i++) {
          const seatNumber = `${type}${row}-${i}`;
          const isReserved = Math.random() > 0.7;
          
          const response = await fetch(`${API_URL}/seats`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              eventId,
              seatNumber,
              isReserved,
            }),
          });
          
          if (!response.ok) {
            console.error(`좌석 생성 실패: ${seatNumber}`);
          }
        }
      }
    }
    
    console.log(`이벤트 ID ${eventId}에 대한 좌석 생성 완료`);
  } catch (error) {
    console.error('좌석 생성 오류:', error.message);
  }
}

// 이벤트 데이터
const events = [
  {
    title: '아이유 콘서트 - 더 골든 아워',
    description: '아이유의 새 앨범 발매를 기념하는 특별한 콘서트입니다. 감미로운 목소리로 여러분을 황금빛 시간으로 초대합니다.',
    location: '올림픽 체조경기장',
    startTime: '2025-07-15T18:00:00+09:00',
    endTime: '2025-07-15T21:00:00+09:00',
  },
  {
    title: '방탄소년단 월드투어 - 서울 특별공연',
    description: '세계적인 인기를 누리고 있는 방탄소년단의 월드투어 서울 특별공연입니다. 화려한 무대와 함께 잠시도 쉬지 않는 공연을 즐기세요.',
    location: '잠실 올림픽 주경기장',
    startTime: '2025-09-10T18:00:00+09:00',
    endTime: '2025-09-10T21:30:00+09:00',
  },
  {
    title: '클래식 오케스트라 - 베토벤 심포니 전집',
    description: '베토벤의 심포니 전집을 하루에 만나보는 특별한 공연입니다. 세계적인 지휘자와 연주자들이 함께하는 고품격 클래식 공연입니다.',
    location: '예술의전당 콘서트홀',
    startTime: '2025-10-15T19:00:00+09:00',
    endTime: '2025-10-15T22:00:00+09:00',
  },
  {
    title: '뮤지컬 오페라 - 레 미제라블',
    description: '세계적인 뮤지컬 오페라 레 미제라블을 한국어 버전으로 만나보세요. 장 발장의 명작을 움직이는 무대와 음악으로 재현합니다.',
    location: '블루스퀘어 인터파크 홀',
    startTime: '2025-11-20T18:30:00+09:00',
    endTime: '2025-11-20T21:30:00+09:00',
  },
  {
    title: '뉴진스 팬미팅 - 버니즈 데이',
    description: '인기 걸그룹 뉴진스의 첫 번째 팬미팅입니다. 다양한 게임과 토크, 특별 공연이 준비되어 있습니다.',
    location: '고척 스카이돔',
    startTime: '2025-08-05T17:00:00+09:00',
    endTime: '2025-08-05T20:00:00+09:00',
  },
];

// 메인 함수
async function main() {
  await loginAsAdmin();
  
  if (!authToken) {
    console.error('인증 토큰을 얻지 못했습니다. 종료합니다.');
    return;
  }
  
  for (const eventData of events) {
    const event = await createEvent(eventData);
    if (event && event.id) {
      await createSeats(event.id);
    }
  }
  
  console.log('모든 이벤트와 좌석 생성이 완료되었습니다.');
}

main().catch(console.error);
