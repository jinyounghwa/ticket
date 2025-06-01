'use client';

import React, { useEffect, useState } from 'react';
import { ticketsAPI } from '../../lib/api';
import { useRouter } from 'next/navigation';

interface Ticket {
  id: string;
  eventId: string;
  seatId: string;
  status: 'RESERVED' | 'CANCELLED' | 'REFUNDED';
  reservedAt: string;
  cancelledAt?: string;
  refundedAt?: string;
  event: {
    id: string;
    title: string;
    location: string;
    startTime: string;
    endTime: string;
  };
  seat: {
    id: string;
    seatNumber: string;
    price: number;
  };
}

export default function MyPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [processingTicketId, setProcessingTicketId] = useState<string | null>(null);

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem('token');
    
    if (!token) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      router.push('/auth/login');
      return;
    }
    
    setIsLoggedIn(true);
    
    const fetchMyTickets = async () => {
      try {
        setLoading(true);
        const response = await ticketsAPI.getMyTickets();
        setTickets(response.data);
        setError(null);
      } catch (err) {
        console.error('티켓 목록을 불러오는 중 오류가 발생했습니다:', err);
        setError('티켓 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, [router]);

  const handleCancelTicket = async (ticketId: string) => {
    if (!confirm('정말로 이 티켓을 취소하시겠습니까?')) {
      return;
    }
    
    try {
      setProcessingTicketId(ticketId);
      await ticketsAPI.cancelTicket(ticketId);
      
      // 티켓 목록 업데이트
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: 'CANCELLED' as const } 
          : ticket
      ));
      
      alert('티켓이 성공적으로 취소되었습니다.');
    } catch (err: any) {
      console.error('티켓 취소 중 오류가 발생했습니다:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        alert(`취소 실패: ${err.response.data.message}`);
      } else {
        alert('티켓 취소 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setProcessingTicketId(null);
    }
  };

  const handleRequestRefund = async (ticketId: string) => {
    if (!confirm('정말로 이 티켓에 대한 환불을 요청하시겠습니까?')) {
      return;
    }
    
    const reason = prompt('환불 사유를 입력해주세요 (선택사항):', '');
    
    try {
      setProcessingTicketId(ticketId);
      await ticketsAPI.requestRefund(ticketId, reason || undefined);
      
      // 티켓 목록 업데이트 - 백엔드에서 상태가 바로 변경되지 않을 수 있으므로 UI만 업데이트
      // 실제 상태는 다음 조회 시 반영됨
      alert('환불 요청이 성공적으로 접수되었습니다.');
      
      // 티켓 목록 다시 불러오기
      const response = await ticketsAPI.getMyTickets();
      setTickets(response.data);
    } catch (err: any) {
      console.error('환불 요청 중 오류가 발생했습니다:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        alert(`환불 요청 실패: ${err.response.data.message}`);
      } else {
        alert('환불 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setProcessingTicketId(null);
    }
  };

  if (!isLoggedIn) {
    return null; // 로그인 페이지로 리다이렉트되므로 아무것도 렌더링하지 않음
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'RESERVED':
        return '예매 완료';
      case 'CANCELLED':
        return '취소됨';
      case 'REFUNDED':
        return '환불 완료';
      default:
        return '알 수 없음';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESERVED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">내 티켓</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 text-lg mb-4">예매한 티켓이 없습니다.</p>
            <a 
              href="/events" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              공연 보러가기
            </a>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    공연
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    좌석
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    구매일
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`/events/${ticket.eventId}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {ticket.event?.title || '공연명 정보 없음'}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.seat?.seatNumber || '좌석 정보 없음'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.seat?.price !== undefined && ticket.seat?.price !== null
                        ? `${ticket.seat.price.toLocaleString()}원`
                        : '가격 정보 없음'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.reservedAt
                        ? new Date(ticket.reservedAt).toLocaleDateString('ko-KR')
                        : '구매 일자 정보 없음'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {ticket.status === 'RESERVED' && (
                        <>
                          <button
                            onClick={() => handleCancelTicket(ticket.id)}
                            disabled={processingTicketId === ticket.id}
                            className="text-red-600 hover:text-red-900 mr-4"
                          >
                            {processingTicketId === ticket.id ? '처리 중...' : '취소'}
                          </button>
                          <button
                            onClick={() => handleRequestRefund(ticket.id)}
                            disabled={processingTicketId === ticket.id}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            {processingTicketId === ticket.id ? '처리 중...' : '환불 요청'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
