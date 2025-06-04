import React, { Suspense } from 'react';
import PaymentSuccessClient from './PaymentSuccessClient';

export const dynamic = "force-dynamic";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}