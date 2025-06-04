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

export default function PaymentClient() {
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
      // 실제 결제 처리 대신 타이머로 처리 시뮬레이션
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
      } else {
        // 회원 예매
        response = await ticketsAPI.create(
          paymentInfo.eventId,
          paymentInfo.seatId
        );
      }
      if (response?.data?.id) {
        router.push(`/payment/success?id=${response.data.id}`);
      } else {
        alert('티켓 생성에 실패했습니다.');
      }
    } catch (err) {
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) return <div className="py-10 text-center">로딩 중...</div>;
  if (error) return <div className="py-10 text-center text-red-600">{error}</div>;
  if (!paymentInfo) return null;

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">결제 정보 입력</h1>
      <div className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <div className="mb-2 font-medium">공연명: {paymentInfo.eventTitle}</div>
          <div className="mb-2">좌석: {paymentInfo.seatName}</div>
          <div className="mb-2">가격: <span className="font-semibold">{paymentInfo.price.toLocaleString()}원</span></div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">카드 번호</label>
            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={handleCardNumberChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 mb-1">만료일 (MM/YY)</label>
              <input type="text" id="expiry-date" placeholder="MM/YY" value={expiryDate} onChange={handleExpiryDateChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input type="text" id="cvv" placeholder="123" value={cvv} onChange={handleCvvChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label htmlFor="cardholder-name" className="block text-sm font-medium text-gray-700 mb-1">카드 소유자 이름</label>
            <input type="text" id="cardholder-name" placeholder="홍길동" value={cardholderName} onChange={e => setCardholderName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-start">
              <input id="agree-terms" type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">결제 약관 및 개인정보 처리방침에 동의합니다.</label>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={handleCancel} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" disabled={isProcessing}>취소</button>
          <button onClick={handlePayment} disabled={isProcessing} className={`px-6 py-3 rounded-md text-white font-medium ${isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{isProcessing ? '처리 중...' : `${paymentInfo?.price.toLocaleString()}원 결제하기`}</button>
        </div>
      </div>
    </div>
  );
}
