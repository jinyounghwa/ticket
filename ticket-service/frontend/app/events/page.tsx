'use client';

import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../../lib/api';
import EventList from '../../components/EventList';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  imageUrl?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // API 호출 시도
        try {
          const response = await eventsAPI.getAll();
          setEvents(response.data);
          setError(null);
        } catch (apiErr) {
          console.error('API 호출 실패, 하드코딩된 데이터 사용:', apiErr);
          // 하드코딩된 데이터 사용
          const mockEvents: Event[] = [
            {
              id: '1',
              title: '아이유 콘서트 - The Golden Hour',
              description: '아이유의 더 골든 아워 콘서트로 여러분을 초대합니다. 아이유의 노래와 함께 특별한 밤을 보내세요.',
              date: '2025-06-15T19:00:00',
              location: '올림픽 공원 체육관',
              price: 110000,
              imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
              id: '2',
              title: '오페라 - 라 트라비아타',
              description: '주세페 베르디의 유명한 오페라 라 트라비아타를 지금 만나보세요. 환상적인 무대와 아름다운 음악이 여러분을 기다리고 있습니다.',
              date: '2025-07-20T18:30:00',
              location: '세종문화회관',
              price: 150000,
              imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
              id: '3',
              title: '지브리 오케스트라 - 영화음악 콘서트',
              description: '지브리 애니메이션의 명곡들을 오케스트라로 만나보세요. 토토로, 하울의 성, 공주 모노노케 등 여러 작품의 음악을 새롭게 해석한 공연입니다.',
              date: '2025-08-05T19:30:00',
              location: '롯데 콘서트홀',
              price: 88000,
              imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
              id: '4',
              title: '방탄소년단 월드투어 - 서울 특별공연',
              description: '세계적인 인기를 누리고 있는 방탄소년단의 월드투어 서울 특별공연입니다. 화려한 무대와 함께 잠시도 쉬지 않는 공연을 즐기세요.',
              date: '2025-09-10T18:00:00',
              location: '장운 올림픽 주경기장',
              price: 165000,
              imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
              id: '5',
              title: '클래식 오케스트라 - 베토벤 심포니 전집',
              description: '베토벤의 심포니 전집을 하루에 만나보는 특별한 공연입니다. 세계적인 지휘자와 연주자들이 함께하는 고품격 클래식 공연입니다.',
              date: '2025-10-15T19:00:00',
              location: '예술의전당 콘서트홀',
              price: 120000,
              imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
              id: '6',
              title: '뮤지컬 오페라 - 레 미제라블',
              description: '세계적인 뮤지컬 오페라 레 미제라블을 한국어 버전으로 만나보세요. 장 발장의 명작을 움직이는 무대와 음악으로 재현합니다.',
              date: '2025-11-20T18:30:00',
              location: '블루스퀘어 인터파크 홀',
              price: 140000,
              imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            }
          ];
          setEvents(mockEvents);
        }
      } catch (err) {
        console.error('이벤트 목록을 불러오는 중 오류가 발생했습니다:', err);
        setError('이벤트 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">오류!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">공연 목록</h1>
        
        {/* API로 가져온 데이터가 있는 경우 */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-gray-300 relative">
                  {event.imageUrl ? (
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">이미지 없음</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <div>{new Date(event.date).toLocaleDateString('ko-KR')}</div>
                    <div>{event.location}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-indigo-600">
                      {event.price.toLocaleString()}원
                    </span>
                    <a 
                      href={`/events/${event.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      상세 보기
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* API로 가져온 데이터가 없는 경우 하드코딩된 데이터 사용 */
          <EventList />
        )}
      </div>
    </div>
  );
}
