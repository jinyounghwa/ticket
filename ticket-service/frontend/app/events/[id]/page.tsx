'use client';

import React, { useEffect, useState } from 'react';
import { eventsAPI, ticketsAPI } from '../../../lib/api';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  imageUrl?: string;
  seats?: Seat[];
}

interface Seat {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        try {
          // API 호출 시도
          const response = await eventsAPI.getById(params.id);
          setEvent(response.data);
          setError(null);
        } catch (apiErr) {
          console.error('API 호출 실패, 하드코딩된 데이터 사용:', apiErr);
          
          // 하드코딩된 데이터 사용
          const mockEvents = [
            {
              id: '1',
              title: '아이유 콘서트 - The Golden Hour',
              description: '아이유의 더 골든 아워 콘서트로 여러분을 초대합니다. 아이유의 노래와 함께 특별한 밤을 보내세요. 최고의 무대 장치와 음향 시스템을 갖춘 올림픽 공원 체육관에서 편안한 좌석에서 아이유의 노래를 만나보세요. 이번 콘서트에서는 아이유의 역대 명곡은 물론, 최근 발매된 신곡도 함께 만나볼 수 있습니다.',
              date: '2025-06-15T19:00:00',
              location: '올림픽 공원 체육관',
              price: 110000,
              imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              seats: [
                { id: '1-A1', name: 'A1', price: 110000, isAvailable: true },
                { id: '1-A2', name: 'A2', price: 110000, isAvailable: true },
                { id: '1-A3', name: 'A3', price: 110000, isAvailable: false },
                { id: '1-B1', name: 'B1', price: 88000, isAvailable: true },
                { id: '1-B2', name: 'B2', price: 88000, isAvailable: true },
                { id: '1-C1', name: 'C1', price: 66000, isAvailable: true },
              ]
            },
            {
              id: '2',
              title: '오페라 - 라 트라비아타',
              description: '주세페 베르디의 유명한 오페라 라 트라비아타를 지금 만나보세요. 환상적인 무대와 아름다운 음악이 여러분을 기다리고 있습니다. 세종문화회관의 우아한 음향과 함께 세계적인 오페라 가수들이 함께하는 이번 공연은 한국에서 좋은 오페라를 만나기 어려운 분들에게 특별한 기회가 될 것입니다.',
              date: '2025-07-20T18:30:00',
              location: '세종문화회관',
              price: 150000,
              imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              seats: [
                { id: '2-VIP1', name: 'VIP1', price: 150000, isAvailable: true },
                { id: '2-VIP2', name: 'VIP2', price: 150000, isAvailable: false },
                { id: '2-R1', name: 'R1', price: 120000, isAvailable: true },
                { id: '2-R2', name: 'R2', price: 120000, isAvailable: true },
                { id: '2-S1', name: 'S1', price: 100000, isAvailable: true },
                { id: '2-S2', name: 'S2', price: 100000, isAvailable: true },
              ]
            },
            {
              id: '3',
              title: '지브리 오케스트라 - 영화음악 콘서트',
              description: '지브리 애니메이션의 명곡들을 오케스트라로 만나보세요. 토토로, 하울의 성, 공주 모노노케 등 여러 작품의 음악을 새롭게 해석한 공연입니다. 아이들부터 어른까지 모두가 함께 즐길 수 있는 이번 공연은 지브리 애니메이션을 사랑하는 모든 분들에게 잘 어울리는 공연이 될 것입니다.',
              date: '2025-08-05T19:30:00',
              location: '롯데 콘서트홀',
              price: 88000,
              imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              seats: [
                { id: '3-A1', name: 'A1', price: 88000, isAvailable: true },
                { id: '3-A2', name: 'A2', price: 88000, isAvailable: true },
                { id: '3-A3', name: 'A3', price: 88000, isAvailable: true },
                { id: '3-B1', name: 'B1', price: 66000, isAvailable: false },
                { id: '3-B2', name: 'B2', price: 66000, isAvailable: true },
                { id: '3-C1', name: 'C1', price: 44000, isAvailable: true },
              ]
            },
            {
              id: '4',
              title: '방탄소년단 월드투어 - 서울 특별공연',
              description: '세계적인 인기를 누리고 있는 방탄소년단의 월드투어 서울 특별공연입니다. 화려한 무대와 함께 잠시도 쉬지 않는 공연을 즐기세요.',
              date: '2025-09-10T18:00:00',
              location: '장운 올림픽 주경기장',
              price: 165000,
              imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              seats: [
                { id: '4-VIP1', name: 'VIP1', price: 165000, isAvailable: false },
                { id: '4-VIP2', name: 'VIP2', price: 165000, isAvailable: false },
                { id: '4-R1', name: 'R1', price: 132000, isAvailable: true },
                { id: '4-R2', name: 'R2', price: 132000, isAvailable: true },
                { id: '4-S1', name: 'S1', price: 110000, isAvailable: true },
                { id: '4-S2', name: 'S2', price: 110000, isAvailable: true },
              ]
            },
            {
              id: '5',
              title: '클래식 오케스트라 - 베토벤 심포니 전집',
              description: '베토벤의 심포니 전집을 하루에 만나보는 특별한 공연입니다. 세계적인 지휘자와 연주자들이 함께하는 고품격 클래식 공연입니다.',
              date: '2025-10-15T19:00:00',
              location: '예술의전당 콘서트홀',
              price: 120000,
              imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              seats: [
                { id: '5-R1', name: 'R1', price: 120000, isAvailable: true },
                { id: '5-R2', name: 'R2', price: 120000, isAvailable: true },
                { id: '5-S1', name: 'S1', price: 100000, isAvailable: true },
                { id: '5-S2', name: 'S2', price: 100000, isAvailable: false },
                { id: '5-A1', name: 'A1', price: 80000, isAvailable: true },
                { id: '5-A2', name: 'A2', price: 80000, isAvailable: true },
              ]
            },
            {
              id: '6',
              title: '뮤지컬 오페라 - 레 미제라블',
              description: '세계적인 뮤지컬 오페라 레 미제라블을 한국어 버전으로 만나보세요. 장 발장의 명작을 움직이는 무대와 음악으로 재현합니다.',
              date: '2025-11-20T18:30:00',
              location: '블루스퀘어 인터파크 홀',
              price: 140000,
              imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              seats: [
                { id: '6-VIP1', name: 'VIP1', price: 140000, isAvailable: true },
                { id: '6-VIP2', name: 'VIP2', price: 140000, isAvailable: true },
                { id: '6-R1', name: 'R1', price: 120000, isAvailable: false },
                { id: '6-R2', name: 'R2', price: 120000, isAvailable: true },
                { id: '6-S1', name: 'S1', price: 100000, isAvailable: true },
                { id: '6-S2', name: 'S2', price: 100000, isAvailable: true },
              ]
            }
          ];
          
          // 해당 ID에 맞는 공연 찾기
          const foundEvent = mockEvents.find(event => event.id === params.id);
          if (foundEvent) {
            setEvent(foundEvent);
            setError(null);
          } else {
            setError('이벤트를 찾을 수 없습니다.');
          }
        }
      } catch (err) {
        console.error('이벤트 상세 정보를 불러오는 중 오류가 발생했습니다:', err);
        setError('이벤트 상세 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [params.id]);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
  };

  const handleBookTicket = async () => {
    if (!selectedSeat) {
      alert('좌석을 선택해주세요.');
      return;
    }

    try {
      setIsBooking(true);
      
      let response;
      
      if (isLoggedIn) {
        // 로그인 사용자 예매
        response = await ticketsAPI.create(event?.id || '', selectedSeat);
      } else {
        // 비회원 예매
        if (!guestEmail) {
          alert('이메일 주소를 입력해주세요.');
          setIsBooking(false);
          return;
        }
        
        response = await ticketsAPI.createGuest(event?.id || '', selectedSeat, guestEmail);
      }
      
      alert('티켓 예매가 완료되었습니다.');
      
      // 예매 완료 후 마이페이지로 이동
      if (isLoggedIn) {
        router.push('/my');
      } else {
        // 비회원은 예매 확인 페이지로 이동
        const guestId = response.data.guestId;
        router.push(`/tickets/guest/${guestId}`);
      }
    } catch (err: any) {
      console.error('티켓 예매 중 오류가 발생했습니다:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        alert(`예매 실패: ${err.response.data.message}`);
      } else {
        alert('티켓 예매 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">오류!</strong>
          <span className="block sm:inline"> {error || '이벤트를 찾을 수 없습니다.'}</span>
        </div>
        <button 
          onClick={() => router.push('/events')} 
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          이벤트 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              {event.imageUrl ? (
                <img 
                  className="h-64 w-full object-cover md:w-96 md:h-full" 
                  src={event.imageUrl} 
                  alt={event.title} 
                />
              ) : (
                <div className="h-64 w-full md:w-96 md:h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">이미지 없음</span>
                </div>
              )}
            </div>
            <div className="p-8 w-full">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {new Date(event.date).toLocaleDateString('ko-KR')}
              </div>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="mt-2 text-gray-600">{event.location}</p>
              <div className="mt-4 text-gray-700">
                {event.description}
              </div>
              <div className="mt-6">
                <div className="text-2xl font-bold text-indigo-600">{event.price.toLocaleString()}원</div>
              </div>
            </div>
          </div>
          
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">좌석 선택</h2>
            
            {event.seats && event.seats.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {event.seats.map((seat) => (
                  <button
                    key={seat.id}
                    disabled={!seat.isAvailable}
                    onClick={() => handleSeatSelect(seat.id)}
                    className={`p-4 rounded-lg text-center transition-colors ${
                      !seat.isAvailable 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : selectedSeat === seat.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-gray-300 hover:border-indigo-500'
                    }`}
                  >
                    <div className="font-medium">{seat.name}</div>
                    <div className="text-sm mt-1">{seat.price.toLocaleString()}원</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">이용 가능한 좌석이 없습니다.</p>
              </div>
            )}
            
            {!isLoggedIn && (
              <div className="mb-6">
                <label htmlFor="guest-email" className="block text-sm font-medium text-gray-700 mb-2">
                  비회원 예매 이메일
                </label>
                <input
                  type="email"
                  id="guest-email"
                  placeholder="예매 확인을 위한 이메일 주소를 입력하세요"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => router.push('/events')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                목록으로 돌아가기
              </button>
              
              <button
                onClick={handleBookTicket}
                disabled={isBooking || !selectedSeat || (!isLoggedIn && !guestEmail)}
                className={`px-6 py-3 rounded-md text-white font-medium ${
                  isBooking || !selectedSeat || (!isLoggedIn && !guestEmail)
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isBooking ? '예매 중...' : '예매하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
