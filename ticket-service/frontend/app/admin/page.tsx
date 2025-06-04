"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { eventsAPI, adminAPI } from "../../lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // localStorage에서 사용자 정보 확인
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/auth/login");
      return;
    }
    try {
      const userObj = JSON.parse(userStr);
      setUser(userObj);
      if (userObj.email === "admin@admin.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        router.push("/");
      }
    } catch (e) {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        // 사용자 목록
        // 사용자 목록 (API에 맞게 수정 필요)
        // const usersRes = await adminAPI.getAllUsers?.();
        // setUsers(usersRes?.data || []);
        setUsers([]); // 임시 빈 배열
        // 공연 목록
        const eventsRes = await eventsAPI.getAll();
        setEvents(eventsRes.data || []);
        setError("");
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [isAdmin]);

  // 공연 삭제
  // 공연 삭제 (API에 맞게 구현 필요)
  // const handleDeleteEvent = async (id) => {
  //   if (!window.confirm("정말 삭제하시겠습니까?")) return;
  //   try {
  //     await eventsAPI.delete(id);
  //     setEvents(events.filter((e) => e.id !== id));
  //   } catch {
  //     alert("삭제 중 오류가 발생했습니다.");
  //   }
  // };
  const handleDeleteEvent = (id) => {
    alert('공연 삭제 기능은 아직 구현되어 있지 않습니다.');
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">관리자 페이지</h1>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">사용자 목록</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">이메일</th>
                    <th className="px-4 py-2 border">권한</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-2 border">{u.id}</td>
                      <td className="px-4 py-2 border">{u.email}</td>
                      <td className="px-4 py-2 border">{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">공연 관리</h2>
            <div className="mb-4">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                onClick={() => router.push("/admin/events/new")}
              >
                공연 추가
              </button>
            </div>
            <div>
              {events.length === 0 ? (
                <div>등록된 공연이 없습니다.</div>
              ) : (
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">ID</th>
                      <th className="px-4 py-2 border">제목</th>
                      <th className="px-4 py-2 border">장소</th>
                      <th className="px-4 py-2 border">시작일</th>
                      <th className="px-4 py-2 border">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="px-4 py-2 border">{event.id}</td>
                        <td className="px-4 py-2 border">{event.title}</td>
                        <td className="px-4 py-2 border">{event.location}</td>
                        <td className="px-4 py-2 border">{event.startTime ? new Date(event.startTime).toLocaleString() : ''}</td>
                        <td className="px-4 py-2 border">
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 mr-2"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
