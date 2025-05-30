import React from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: '티켓 예매 서비스',
  description: '다양한 공연과 이벤트의 티켓을 예매하는 서비스입니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>{children}</main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>© 2025 티켓 예매 서비스. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
