# 티켓 예매 서비스

공연 및 이벤트 티켓 예매를 위한 웹 서비스입니다. 사용자는 다양한 공연을 검색하고 예매할 수 있으며, 관리자는 공연과 티켓을 관리할 수 있습니다.

## 기술 스택

### 백엔드
- **프레임워크**: NestJS
- **데이터베이스**: SQLite (개발), PostgreSQL (프로덕션)
- **ORM**: Prisma
- **인증**: JWT
- **API 문서화**: Swagger

### 프론트엔드
- **프레임워크**: Next.js
- **스타일링**: Tailwind CSS
- **상태 관리**: React Hooks
- **HTTP 클라이언트**: Axios

## 주요 기능

### 사용자 기능
- 회원가입 및 로그인
- 공연 목록 조회 및 상세 정보 확인
- 티켓 예매 및 결제
- 예매 내역 조회 및 취소
- 비회원 예매 및 조회

### 관리자 기능
- 공연 등록, 수정, 삭제
- 좌석 관리
- 티켓 판매 통계 확인
- 환불 요청 관리

## 설치 및 실행 방법

### 사전 요구사항
- Node.js 18 이상
- Yarn 패키지 매니저
- Git

### 설치

1. 저장소 클론
```bash
git clone https://github.com/your-username/ticket-service.git
cd ticket-service
```

2. 백엔드 설치 및 설정
```bash
cd backend
yarn install
```

3. 프론트엔드 설치 및 설정
```bash
cd ../frontend
yarn install
```

4. 환경 변수 설정
   - 백엔드 루트 디렉토리에 `.env` 파일 생성
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_jwt_secret_key"
   PORT=4003
   ```

5. 데이터베이스 마이그레이션
```bash
cd ../backend
npx prisma migrate dev
```

### 실행

1. 백엔드 서버 실행
```bash
cd backend
yarn start:dev
```

2. 프론트엔드 서버 실행
```bash
cd ../frontend
yarn dev
```

3. 브라우저에서 접속
   - 프론트엔드: http://localhost:3000
   - 백엔드 API: http://localhost:4003
   - Swagger 문서: http://localhost:4003/api

## API 문서

백엔드 서버를 실행한 후 Swagger 문서를 통해 API를 확인할 수 있습니다.
- URL: http://localhost:4003/api

## 프로젝트 구조

```
ticket-service/
├── backend/                # 백엔드 (NestJS)
│   ├── prisma/             # Prisma 스키마 및 마이그레이션
│   ├── src/                # 소스 코드
│   │   ├── admin/          # 관리자 모듈
│   │   ├── auth/           # 인증 모듈
│   │   ├── events/         # 공연 모듈
│   │   ├── prisma/         # Prisma 서비스
│   │   ├── tickets/        # 티켓 모듈
│   │   ├── users/          # 사용자 모듈
│   │   ├── app.module.ts   # 앱 모듈
│   │   └── main.ts         # 진입점
│   └── package.json        # 백엔드 의존성
│
└── frontend/               # 프론트엔드 (Next.js)
    ├── app/                # 페이지 컴포넌트
    │   ├── auth/           # 인증 관련 페이지
    │   ├── events/         # 공연 관련 페이지
    │   └── my/             # 마이페이지
    ├── components/         # 재사용 컴포넌트
    ├── lib/                # 유틸리티 함수
    ├── styles/             # 스타일 파일
    └── package.json        # 프론트엔드 의존성
```

## 라이센스

MIT
