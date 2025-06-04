'use client';

import React from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  imageUrl?: string;
}


interface EventListProps {
  events: Event[];
  limit?: number;
}

export default function EventList({ events, limit }: EventListProps) {
  const displayEvents = limit ? events.slice(0, limit) : events;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayEvents.map((event) => (
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
              <div>
                {event.date ? new Date(event.date).toLocaleDateString('ko-KR') : '날짜 정보 없음'}
              </div>
              <div>{event.location || '장소 정보 없음'}</div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-indigo-600">
                {event.price !== undefined && event.price !== null
                  ? `${event.price.toLocaleString()}원`
                  : '가격 정보 없음'}
              </span>
              <Link 
                href={`/events/${event.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                상세 보기
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
