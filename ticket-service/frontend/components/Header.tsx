'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token) {
      setIsLoggedIn(true);
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {
          console.error('사용자 정보 파싱 오류:', e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              티켓 서비스
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/events" className="text-gray-600 hover:text-gray-900">
              공연
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link href="/my" className="text-gray-600 hover:text-gray-900">
                  마이페이지
                </Link>
                <span className="text-gray-600">
                  {user?.email}님
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                  로그인
                </Link>
                <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
