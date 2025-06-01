'use client';

import React, { useEffect, useState } from 'react';
import { eventsAPI, ticketsAPI } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'next/navigation';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
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

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 일반 ID를 UUID로 변환하는 함수
  const convertToUUID = (id: string): string => {
    // 이미 UUID 형식이면 그대로 반환
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return id;
    }
    
    // 간단한 ID를 UUID로 변환 (결정적으로 생성하기 위해 ID를 시드로 사용)
    // 실제 환경에서는 서버에서 UUID를 제공하는 것이 좋습니다
    const seed = parseInt(id, 10) || 0;
    let uuid = '';
    
    // 간단한 시드 기반 UUID 생성 (실제 환경에서는 더 나은 방법 사용 권장)
    try {
      // 시드 기반으로 결정적 UUID 생성
      const seedStr = `seed-${seed}-${id}`;
      uuid = uuidv4({ random: Array.from({ length: 16 }, (_, i) => 
        seedStr.charCodeAt(i % seedStr.length)) });
    } catch (e) {
      // 변환 실패 시 새 UUID 생성
      uuid = uuidv4();
    }
    
    console.log(`ID 변환: ${id} -> ${uuid}`);
    return uuid;
  };

  useEffect(() => {
    // 로그인 상태 확인
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        
        // params가 있는지 확인
        const eventId = params?.id as string;
        if (!eventId) {
          throw new Error('이벤트 ID를 찾을 수 없습니다.');
        }
        
        console.log('이벤트 ID:', eventId);
        
        // 이벤트 정보 가져오기 - 먼저 원래 ID로 시도하고, 실패하면 UUID로 변환하여 재시도
        let eventData;
        let eventIdForSeats = eventId;
        
        try {
          // 원래 ID로 먼저 시도
          console.log('원래 ID로 이벤트 정보 요청');
          const response = await eventsAPI.getById(eventId);
          eventData = response.data;
          console.log('원래 ID로 이벤트 정보 요청 성공:', eventData);
        } catch (originalError) {
          // 실패하면 UUID로 변환하여 재시도
          console.log('원래 ID로 요청 실패, UUID 변환 시도');
          const uuidEventId = convertToUUID(eventId);
          console.log('변환된 UUID:', uuidEventId);
          
          try {
            const response = await eventsAPI.getById(uuidEventId);
            eventData = response.data;
            eventIdForSeats = uuidEventId; // 좌석 요청에 사용할 ID 업데이트
            console.log('UUID 변환 후 이벤트 정보 요청 성공:', eventData);
          } catch (uuidError) {
            console.error('UUID 변환 후에도 요청 실패:', uuidError);
            throw uuidError;
          }
        }
        
        // 이벤트 데이터 설정
        if (eventData) {
          setEvent(eventData);
          setError(null);
          
          // 좌석 정보 가져오기
          try {
            console.log('이벤트의 좌석 정보 요청:', eventIdForSeats);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
            const seatsResponse = await fetch(`${API_URL}/events/${eventIdForSeats}/seats`);
            const seatsData = await seatsResponse.json();
            console.log('좌석 정보 응답:', seatsData);
            // 좌석 데이터 구조 상세 확인
            if (Array.isArray(seatsData) && seatsData.length > 0) {
              console.log('첫 번째 좌석 구조:', JSON.stringify(seatsData[0], null, 2));
              console.log('좌석 ID 형식:', seatsData[0].id);
              console.log('좌석 이름 형식:', seatsData[0].seatNumber || seatsData[0].name);
              console.log('좌석 예약 상태:', seatsData[0].isReserved !== undefined ? 'isReserved 사용' : 'isAvailable 사용');
            }
            
            if (Array.isArray(seatsData) && seatsData.length > 0) {
              // 백엔드 좌석 데이터 구조를 프론트엔드 구조에 맞게 변환
              const mappedSeats = seatsData.map(seat => ({
                id: seat.id,
                name: seat.seatNumber || `좌석 ${seat.id.substring(0, 4)}`,
                price: seat.price || 10000, // 가격 정보가 없으면 기본값 사용
                isAvailable: seat.isReserved !== undefined ? !seat.isReserved : true
              }));
              
              console.log('변환된 좌석 데이터:', mappedSeats[0]);
              
              // 이벤트 데이터에 변환된 좌석 정보 추가
              setEvent(prev => prev ? { ...prev, seats: mappedSeats } : null);
            } else {
              console.warn('이 이벤트에 등록된 좌석이 없습니다:', eventIdForSeats);
            }
          } catch (seatsErr) {
            console.error('좌석 정보를 불러오는 중 오류가 발생했습니다:', seatsErr);
            // 좌석 정보를 가져오는 데 실패해도 이벤트 정보는 표시
          }
        } else {
          setError('이벤트 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('이벤트 상세 정보를 불러오는 중 오류가 발생했습니다:', err);
        
        // 오류 상세 정보 출력
        if (err.response) {
          console.error('응답 데이터:', err.response.data);
          console.error('응답 상태 코드:', err.response.status);
          console.error('응답 헤더:', err.response.headers);
        } else if (err.request) {
          console.error('요청 정보:', err.request);
        } else {
          console.error('오류 메시지:', err.message);
        }
        
        // 임시 테스트 데이터 사용 (실제 서버가 없는 경우)
        if (err.response && err.response.status === 404) {
          console.log('임시 테스트 데이터 사용');
          const now = new Date();
          const endTime = new Date(now);
          endTime.setHours(now.getHours() + 3); // 3시간 후 종료
          
          const mockEvent = {
            id: params?.id as string,
            title: '테스트 이벤트',
            description: '이것은 테스트 이벤트입니다. 실제 서버가 없는 경우 테스트용으로 표시됩니다.',
            startTime: now.toISOString(),
            endTime: endTime.toISOString(),
            location: '테스트 장소',
            price: 10000,
            imageUrl: 'https://via.placeholder.com/400x200?text=테스트+이벤트',
            seats: [
              { id: '1', name: 'A1', price: 10000, isAvailable: true },
              { id: '2', name: 'A2', price: 10000, isAvailable: false },
              { id: '3', name: 'B1', price: 8000, isAvailable: true },
              { id: '4', name: 'B2', price: 8000, isAvailable: true },
            ]
          };
          setEvent(mockEvent);
          setError(null);
          setLoading(false);
          return;
        }
        
        setError('이벤트 상세 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [params]);

  const handleSeatSelect = (seatId: string) => {
    console.log('좌석 선택:', seatId);
    setSelectedSeat(seatId);
    console.log('선택된 좌석 상태:', selectedSeat); // 이것은 업데이트 전 상태를 보여줌
    
    // 좌석 선택 후 상태 확인
    setTimeout(() => {
      console.log('업데이트 후 선택된 좌석:', selectedSeat);
    }, 0);
  };

  const handleBookTicket = async () => {
    if (!selectedSeat) {
      alert('좌석을 선택해주세요.');
      return;
    }

    try {
      setIsBooking(true);
      
      const eventId = event?.id;
      
      if (!eventId) {
        throw new Error('이벤트 정보를 찾을 수 없습니다.');
      }
      
      // UUID 형식으로 변환 (이미 UUID 형식이면 그대로 사용, 아니면 변환)
      const uuidEventId = convertToUUID(eventId);
      const uuidSeatId = convertToUUID(selectedSeat);
      
      console.log('예매 정보:', { eventId: uuidEventId, seatId: uuidSeatId });
      
      // UUID 형식 검증
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidPattern.test(uuidEventId) || !uuidPattern.test(uuidSeatId)) {
        throw new Error('유효한 이벤트 또는 좌석 ID가 아닙니다. 관리자에게 문의하세요.');
      }
      
      // 비회원 예매 시 이메일 검증
      if (!isLoggedIn) {
        if (!guestEmail) {
          alert('이메일 주소를 입력해주세요.');
          setIsBooking(false);
          return;
        }
        
        if (!validateEmail(guestEmail)) {
          alert('유효한 이메일 주소를 입력해주세요.');
          setIsBooking(false);
          return;
        }
      }
      
      // 선택한 좌석 정보 찾기
      const selectedSeatInfo = event.seats?.find(seat => seat.id === selectedSeat);
      
      // 결제 페이지로 이동
      const queryParams = new URLSearchParams({
        eventId: uuidEventId,
        eventTitle: event.title,
        seatId: uuidSeatId,
        seatName: selectedSeatInfo?.name || '알 수 없는 좌석',
        price: selectedSeatInfo?.price?.toString() || event.price.toString()
      });
      
      // 비회원 예매 시 이메일 추가
      if (!isLoggedIn && guestEmail) {
        queryParams.append('email', guestEmail);
      }
      
      router.push(`/payment?${queryParams.toString()}`);
    } catch (err: any) {
      console.error('티켓 예매 처리 중 오류가 발생했습니다:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        alert(`예매 실패: ${err.response.data.message}`);
      } else if (err.message) {
        alert(`예매 실패: ${err.message}`);
      } else {
        alert('티켓 예매 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsBooking(false);
    }
  };
  
  // 이메일 유효성 검사 함수
  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
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
                  className="h-80 w-full object-cover md:w-96 md:h-full rounded-t-lg md:rounded-l-lg md:rounded-t-none" 
                  src={event.imageUrl} 
                  alt={event.title} 
                />
              ) : (
                <div className="h-80 w-full md:w-96 md:h-full bg-gray-200 flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                  <span className="text-gray-400">이미지 없음</span>
                </div>
              )}
            </div>
            <div className="p-8 w-full">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {new Date(event.startTime).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </div>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="mt-2 text-gray-600">
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </span>
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {event.startTime && event.endTime ? (
                    <>
                      {new Date(event.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ~ {new Date(event.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </>
                  ) : '시간 정보 없음'}
                </span>
              </p>
              <div className="mt-6 text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
                {event.description}
              </div>
              <div className="mt-6">
                <div className="text-2xl font-bold text-indigo-600">
                  {event.price !== undefined ? `${event.price.toLocaleString()}원` : '가격 정보 없음'}
                </div>
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
                    <div className="font-medium">{seat.name || '좌석 정보'}</div>
                    <div className="text-sm mt-1">
                      {seat.price !== undefined && seat.price !== null
                        ? `${seat.price.toLocaleString()}원`
                        : '가격 정보 없음'}
                    </div>
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
