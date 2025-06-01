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
- **프레임워크**: Next.js 15.3.3
- **스타일링**: Tailwind CSS
- **상태 관리**: React Hooks
- **HTTP 클라이언트**: Axios

## 주요 기능

### 사용자 기능
- 회원가입 및 로그인
- 공연 목록 조회 및 상세 정보 확인
- 티켓 예매 및 결제 프로세스
  - 이벤트 선택
  - 좌석 선택
  - 결제 정보 입력
  - 결제 처리 (시뮬레이션)
  - 티켓 발급
- 예매 내역 조회 및 취소
- 환불 요청
- 비회원 예매 및 조회

### 티켓 상태 관리
- **예매 완료(RESERVED)**: 티켓 예매 및 결제 완료 상태
- **취소됨(CANCELLED)**: 사용자가 티켓을 취소한 상태
- **환불됨(REFUNDED)**: 환불 요청이 승인된 상태

### 결제 시스템
- 카드 정보 입력 (카드번호, 만료일, CVV, 소유자명)
- 결제 약관 동의
- 결제 처리 시뮬레이션 (실제 결제 게이트웨이 연동 없음)
- 결제 성공/실패 처리

### 관리자 기능
- 공연 등록, 수정, 삭제
- 좌석 관리
- 티켓 판매 통계 확인
- 환불 요청 관리

## 프로젝트 구조

### 프론트엔드 (Next.js)
- `/app` - 페이지 컴포넌트
  - `/auth` - 로그인/회원가입 페이지
  - `/events` - 이벤트 목록 및 상세 페이지
  - `/my` - 마이페이지 (예매 내역 관리)
  - `/payment` - 결제 페이지
  - `/tickets` - 티켓 조회 페이지
- `/lib` - API 호출 및 유틸리티 함수

### 백엔드 (NestJS)
- `/prisma` - Prisma 스키마 및 마이그레이션
- `/src` - 백엔드 소스 코드
  - `/auth` - 인증 관련 모듈
  - `/events` - 이벤트 관리 모듈
  - `/seats` - 좌석 관리 모듈
  - `/tickets` - 티켓 관리 모듈
  - `/users` - 사용자 관리 모듈

## 설치 및 실행 방법

### 사전 요구사항
- Node.js 18 이상
- Yarn 패키지 매니저
- Git

### 설치

1. 저장소 클론
```bash
git clone https://github.com/jinyounghwa/ticket.git
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
yarn prisma migrate dev
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
