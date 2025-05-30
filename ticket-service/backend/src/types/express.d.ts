import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role: Role;
    }
  }
}

// 이 파일이 모듈로 인식되도록 빈 export 추가
export {};
