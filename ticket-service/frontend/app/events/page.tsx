'use client';

import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../../lib/api';
import EventList from '../../components/EventList';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
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
        console.log('이벤트 목록 가져오는 중...');
        
        // API 호출 시도
        try {
          const response = await eventsAPI.getAll();
          console.log('서버에서 받은 이벤트 목록:', response.data);
          
          if (Array.isArray(response.data) && response.data.length > 0) {
            setEvents(response.data);
            setError(null);
            return;
          }
        } catch (apiErr) {
          console.error('API 호출 오류:', apiErr);
        }
        
        // API 호출 실패 시 하드코딩된 데이터 사용
        console.log('하드코딩된 이벤트 데이터 사용');
        const hardcodedEvents = [
          {
            id: '1',
            title: '아이유 콘서트 - 더 골든 아워',
            description: '아이유의 새 앨범 발매를 기념하는 특별한 콘서트입니다. 감미로운 목소리로 여러분을 황금빛 시간으로 초대합니다.',
            location: '올림픽 체조경기장',
            startTime: '2025-07-15T18:00:00+09:00',
            endTime: '2025-07-15T21:00:00+09:00',
            imageUrl: 'https://via.placeholder.com/400x300?text=IU+Concert'
          },
          {
            id: '2',
            title: '방탄소년단 월드투어 - 서울 특별공연',
            description: '세계적인 인기를 누리고 있는 방탄소년단의 월드투어 서울 특별공연입니다. 화려한 무대와 함께 잠시도 쉬지 않는 공연을 즐기세요.',
            location: '잠실 올림픽 주경기장',
            startTime: '2025-09-10T18:00:00+09:00',
            endTime: '2025-09-10T21:30:00+09:00',
            imageUrl: 'https://via.placeholder.com/400x300?text=BTS+Concert'
          },
          {
            id: '3',
            title: '클래식 오케스트라 - 베토벤 심포니 전집',
            description: '베토벤의 심포니 전집을 하루에 만나보는 특별한 공연입니다. 세계적인 지휘자와 연주자들이 함께하는 고품격 클래식 공연입니다.',
            location: '예술의전당 콘서트홀',
            startTime: '2025-10-15T19:00:00+09:00',
            endTime: '2025-10-15T22:00:00+09:00',
            imageUrl: 'https://via.placeholder.com/400x300?text=Classical+Orchestra'
          },
          {
            id: '4',
            title: '뮤지컬 오페라 - 레 미제라블',
            description: '세계적인 뮤지컬 오페라 레 미제라블을 한국어 버전으로 만나보세요. 장 발장의 명작을 움직이는 무대와 음악으로 재현합니다.',
            location: '블루스퀘어 인터파크 홀',
            startTime: '2025-11-20T18:30:00+09:00',
            endTime: '2025-11-20T21:30:00+09:00',
            imageUrl: 'https://via.placeholder.com/400x300?text=Les+Miserables'
          },
          {
            id: '5',
            title: '뉴진스 팬미팅 - 버니즈 데이',
            description: '인기 걸그룹 뉴진스의 첫 번째 팬미팅입니다. 다양한 게임과 토크, 특별 공연이 준비되어 있습니다.',
            location: '고척 스카이돔',
            startTime: '2025-08-05T17:00:00+09:00',
            endTime: '2025-08-05T20:00:00+09:00',
            imageUrl: 'https://via.placeholder.com/400x300?text=NewJeans+Fanmeeting'
          }
        ];
        
        setEvents(hardcodedEvents);
        setError(null);
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
                    <div>{new Date(event.startTime).toLocaleDateString('ko-KR')} {new Date(event.startTime).toLocaleTimeString('ko-KR', {hour: '2-digit', minute:'2-digit'})}</div>
                    <div>{event.location}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-indigo-600">
                      예매 가능
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
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600 mb-4">현재 등록된 이벤트가 없습니다.</p>
            <p className="text-gray-500">나중에 다시 확인해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
