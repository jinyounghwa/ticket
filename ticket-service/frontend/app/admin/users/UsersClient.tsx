'use client';

import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../lib/api';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  createdAt: string;
  isAdmin: boolean;
}

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers(currentPage, 10);
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      console.error('사용자 목록을 불러오는 중 오류가 발생했습니다:', err);
      setError(err.response?.data?.message || '사용자 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h3 className="text-red-800 font-medium">오류 발생</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">사용자 관리</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">이메일</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">가입일</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">권한</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">{user.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {user.isAdmin ? (
                      <span className="bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full text-xs">
                        관리자
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 py-1 px-2 rounded-full text-xs">
                        일반 사용자
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Link 
                      href={`/admin/users/${user.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  사용자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              이전
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              다음
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
