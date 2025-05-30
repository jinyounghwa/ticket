'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import EventList from '../components/EventList';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(userStr);
        setUsername(userData.email);
      } catch (e) {
        console.error('사용자 정보 파싱 오류:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            티켓 예매 서비스
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            다양한 공연과 이벤트의 티켓을 예매하세요.
          </p>
          
          {isLoggedIn ? (
            <div className="mt-8">
              <p className="text-lg text-gray-700 mb-4">
                {username}님, 환영합니다! 지금 공연을 둘러보세요.
              </p>
              <div className="inline-flex rounded-md shadow">
                <Link href="/events" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  공연 보기
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link href="/my" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50">
                  마이페이지
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link href="/events" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  공연 보기
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link href="/auth/login" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50">
                  로그인
                </Link>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">추천 공연</h2>
          <EventList limit={3} />
          
          <div className="mt-8 text-center">
            <Link href="/events" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 shadow">
              모든 공연 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
