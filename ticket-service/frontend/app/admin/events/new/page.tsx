"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { eventsAPI } from "../../../../lib/api";

export default function AdminEventNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await eventsAPI.create({
        title,
        description,
        location,
        startTime,
        endTime,
        price,
        imageUrl,
      });
      if (res.data?.id) {
        alert("공연이 성공적으로 추가되었습니다.");
        router.push("/admin");
      } else {
        setError("공연 추가에 실패했습니다.");
      }
    } catch (err: any) {
      setError("공연 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">공연 추가</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-1">공연명</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block mb-1">설명</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block mb-1">장소</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-1">시작 시간</label>
            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div className="flex-1">
            <label className="block mb-1">종료 시간</label>
            <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border px-3 py-2 rounded" required />
          </div>
        </div>
        <div>
          <label className="block mb-1">가격 (원)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border px-3 py-2 rounded" min="0" required />
        </div>
        <div>
          <label className="block mb-1">이미지 URL</label>
          <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" disabled={loading}>
            {loading ? "등록 중..." : "공연 등록"}
          </button>
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => router.push("/admin")}>취소</button>
        </div>
      </form>
    </div>
  );
}
