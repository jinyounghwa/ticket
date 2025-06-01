'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ticketsAPI } from '../../lib/api';

interface PaymentInfo {
  eventId: string;
  eventTitle: string;
  seatId: string;
  seatName: string;
  price: number;
  email?: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 결제 정보
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  
  // 약관 동의
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  useEffect(() => {
    // URL 파라미터에서 결제 정보 가져오기
    const eventId = searchParams?.get('eventId');
    const eventTitle = searchParams?.get('eventTitle');
    const seatId = searchParams?.get('seatId');
    const seatName = searchParams?.get('seatName');
    const price = searchParams?.get('price');
    const email = searchParams?.get('email');
    
    if (!eventId || !seatId || !price) {
      setError('결제 정보를 찾을 수 없습니다.');
      setLoading(false);
      return;
    }
    
    setPaymentInfo({
      eventId,
      eventTitle: eventTitle || '이벤트 정보 없음',
      seatId,
      seatName: seatName || '좌석 정보 없음',
      price: parseInt(price, 10),
      email: email || undefined
    });
    
    setLoading(false);
  }, [searchParams]);
  
  const formatCardNumber = (value: string) => {
    // 숫자만 남기고 나머지 제거
    const numbers = value.replace(/\D/g, '');
    
    // 4자리씩 끊어서 표시
    const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers;
    
    return formatted.substring(0, 19); // 최대 16자리 + 공백 3개
  };
  
  const formatExpiryDate = (value: string) => {
    // 숫자만 남기고 나머지 제거
    const numbers = value.replace(/\D/g, '');
    
    // MM/YY 형식으로 변환
    if (numbers.length > 2) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
    }
    
    return numbers;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };
  
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력 가능하고 최대 3자리
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCvv(value);
  };
  
  const validateForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      alert('유효한 카드 번호를 입력해주세요.');
      return false;
    }
    
    if (!expiryDate || expiryDate.length < 5) {
      alert('유효한 만료일을 입력해주세요.');
      return false;
    }
    
    if (!cvv || cvv.length < 3) {
      alert('유효한 CVV를 입력해주세요.');
      return false;
    }
    
    if (!cardholderName) {
      alert('카드 소유자 이름을 입력해주세요.');
      return false;
    }
    
    if (!agreeTerms) {
      alert('결제 약관에 동의해주세요.');
      return false;
    }
    
    return true;
  };
  
  const handlePayment = async () => {
    if (!validateForm() || !paymentInfo) return;
    
    try {
      setIsProcessing(true);
      
      // 여기서는 실제 결제 처리 대신 타이머로 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 결제 성공 후 티켓 생성
      let response;
      
      if (paymentInfo.email) {
        // 비회원 예매
        response = await ticketsAPI.createGuest(
          paymentInfo.eventId,
          paymentInfo.seatId,
          paymentInfo.email
        );
        
        // 비회원 티켓 확인 페이지로 이동
        const guestId = response.data.guest?.id || response.data.guestId;
        if (guestId) {
          router.push(`/tickets/guest/${guestId}?payment=success`);
        } else {
          console.error('게스트 ID를 찾을 수 없습니다:', response.data);
          router.push('/payment/success');
        }
      } else {
        // 회원 예매
        response = await ticketsAPI.create(
          paymentInfo.eventId,
          paymentInfo.seatId
        );
        
        // 마이페이지로 이동
        router.push('/my?payment=success');
      }
      
    } catch (err: any) {
      console.error('결제 처리 중 오류가 발생했습니다:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        alert(`결제 실패: ${err.response.data.message}`);
      } else {
        alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCancel = () => {
    if (confirm('결제를 취소하시겠습니까?')) {
      router.back();
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => router.push('/events')}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              이벤트 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">결제 정보</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">예매 정보</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">공연:</span>
                <span className="font-medium">{paymentInfo?.eventTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">좌석:</span>
                <span className="font-medium">{paymentInfo?.seatName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">가격:</span>
                <span className="font-medium text-indigo-600">
                  {paymentInfo?.price.toLocaleString()}원
                </span>
              </div>
              {paymentInfo?.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">이메일:</span>
                  <span className="font-medium">{paymentInfo.email}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">카드 정보 입력</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                  카드 번호
                </label>
                <input
                  type="text"
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 mb-1">
                    만료일 (MM/YY)
                  </label>
                  <input
                    type="text"
                    id="expiry-date"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="cardholder-name" className="block text-sm font-medium text-gray-700 mb-1">
                  카드 소유자 이름
                </label>
                <input
                  type="text"
                  id="cardholder-name"
                  placeholder="홍길동"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="mt-4">
                <div className="flex items-start">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                    결제 약관 및 개인정보 처리방침에 동의합니다.
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            disabled={isProcessing}
          >
            취소
          </button>
          
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`px-6 py-3 rounded-md text-white font-medium ${
              isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isProcessing ? '처리 중...' : `${paymentInfo?.price.toLocaleString()}원 결제하기`}
          </button>
        </div>
      </div>
    </div>
  );
}
