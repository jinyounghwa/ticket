import React, { Suspense } from 'react';
import UsersClient from './UsersClient';

export const dynamic = "force-dynamic";

export default function UsersPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <UsersClient />
    </Suspense>
  );
}
