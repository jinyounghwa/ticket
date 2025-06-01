'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface Ticket {
  id: string;
  event: {
    id: string;
    title: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    price: number;
    imageUrl?: string;
  };
  seat: {
    id: string;
    seatNumber: string;
    price: number;
  };
  createdAt: string;
}

interface GuestTicket {
  id: string;
  email: string;
  tickets: Ticket[];
}

export default function GuestTicketPage() {
  const params = useParams();
  const router = useRouter();
  const [guestTicket, setGuestTicket] = useState<GuestTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuestTicket = async () => {
      try {
        setLoading(true);
        const guestId = params.id as string;
        
        if (!guestId) {
          setError('티켓 정보를 찾을 수 없습니다.');
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const response = await axios.get(`${API_URL}/tickets/guest/${guestId}`);
        
        setGuestTicket(response.data);
        setError(null);
      } catch (err: any) {
        console.error('티켓 정보를 불러오는 중 오류가 발생했습니다:', err);
        setError('티켓 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuestTicket();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !guestTicket) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h2>
              <p className="text-gray-600 mb-6">{error || '티켓 정보를 찾을 수 없습니다.'}</p>
              <Link href="/events" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                이벤트 목록으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-indigo-600 mb-2">예매 완료</h1>
              <p className="text-gray-600">아래 정보로 예매가 완료되었습니다.</p>
            </div>
            
            <div className="mb-6 text-center">
              <div className="text-gray-600 mb-1">예매자 이메일</div>
              <div className="text-xl font-semibold">{guestTicket.email}</div>
            </div>
            
            {guestTicket.tickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">{ticket.event.title}</h2>
                  <div className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-semibold">
                    티켓 번호: {ticket.id.substring(0, 8)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-gray-600 mb-1">공연 장소</div>
                    <div className="font-semibold">{ticket.event.location}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">공연 일시</div>
                    <div className="font-semibold">
                      {ticket.event.startTime && ticket.event.endTime ? (
                        <>
                          {new Date(ticket.event.startTime).toLocaleDateString('ko-KR')} {' '}
                          {new Date(ticket.event.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ~ {' '}
                          {new Date(ticket.event.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </>
                      ) : '일시 정보 없음'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-gray-600 mb-1">좌석 정보</div>
                    <div className="font-semibold">
                      {ticket.seat.seatNumber || '좌석 번호 정보 없음'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">좌석 가격</div>
                    <div className="font-semibold">
                      {ticket.seat.price !== undefined && ticket.seat.price !== null
                        ? `${ticket.seat.price.toLocaleString()}원`
                        : '가격 정보 없음'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-gray-600 mb-1">예매 일시</div>
                  <div className="font-semibold">
                    {ticket.createdAt ? (
                      <>
                        {new Date(ticket.createdAt).toLocaleDateString('ko-KR')} {' '}
                        {new Date(ticket.createdAt).toLocaleTimeString('ko-KR')}
                      </>
                    ) : '예매 일시 정보 없음'}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-8 text-center">
              <Link href="/events" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
                이벤트 목록으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          <p>티켓 정보는 입력하신 이메일로도 발송되었습니다. 공연장 입장 시 티켓 번호가 필요합니다.</p>
        </div>
      </div>
    </div>
  );
}
