'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  
  // 결제 정보 (URL 파라미터에서 가져옴)
  const ticketId = searchParams?.get('ticketId');
  const eventTitle = searchParams?.get('eventTitle');
  
  useEffect(() => {
    // 5초 후 자동으로 마이페이지 또는 이벤트 목록으로 이동
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // 로그인 상태에 따라 다른 페이지로 이동
          const token = localStorage.getItem('token');
          if (token) {
            router.push('/my');
          } else {
            router.push('/events');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [router]);
  
  const handleGoToMyPage = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/my');
    } else {
      router.push('/events');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-green-50 border-b border-green-100">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-green-800 mb-2">결제 완료</h1>
          <p className="text-center text-green-700">
            티켓 예매가 성공적으로 완료되었습니다.
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {eventTitle && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">예매 정보</h3>
                <p className="text-gray-600 mt-1">공연: {eventTitle}</p>
                {ticketId && <p className="text-gray-600">티켓 번호: {ticketId}</p>}
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-700">안내사항</h3>
              <ul className="list-disc list-inside text-blue-600 mt-1 space-y-1 text-sm">
                <li>예매 내역은 마이페이지에서 확인하실 수 있습니다.</li>
                <li>공연 당일 QR코드를 통해 입장하실 수 있습니다.</li>
                <li>공연 시작 1시간 전까지 취소 가능합니다.</li>
                <li>문의사항은 고객센터로 연락해주세요.</li>
              </ul>
            </div>
            
            <div className="text-center text-gray-500 text-sm">
              {countdown > 0 ? (
                <p>{countdown}초 후 자동으로 이동합니다...</p>
              ) : (
                <p>이동 중...</p>
              )}
            </div>
            
            <button
              onClick={handleGoToMyPage}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {localStorage.getItem('token') ? '마이페이지로 이동' : '이벤트 목록으로 이동'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
