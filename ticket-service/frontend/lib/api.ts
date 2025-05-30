import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 처리 (인증 만료)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// API 함수들
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string) => 
    api.post('/auth/register', { email, password }),
};

export const eventsAPI = {
  getAll: () => 
    api.get('/events'),
  
  getById: (id: string) => 
    api.get(`/events/${id}`),
};

export const ticketsAPI = {
  create: (eventId: string, seatId: string) => 
    api.post('/tickets', { eventId, seatId }),
  
  createGuest: (eventId: string, seatId: string, email: string) => 
    api.post('/tickets/guest', { eventId, seatId, email }),
  
  getMyTickets: () => 
    api.get('/tickets'),
  
  getGuestTickets: (guestId: string) => 
    api.get(`/tickets/guest/${guestId}`),
  
  cancelTicket: (ticketId: string) => 
    api.post('/tickets/cancel', { ticketId }),
  
  requestRefund: (ticketId: string, reason?: string) => 
    api.post(`/tickets/refund/${ticketId}`, { reason }),
};

export const adminAPI = {
  getAllTickets: (page = 1, limit = 10, status?: string) => 
    api.get('/admin/tickets', { params: { page, limit, status } }),
  
  getEventStatistics: (eventId: string) => 
    api.get(`/admin/statistics/event/${eventId}`),
  
  getAllStatistics: () => 
    api.get('/admin/statistics'),
  
  getPendingRefundRequests: () => 
    api.get('/admin/refund-requests'),
  
  approveRefund: (refundRequestId: string) => 
    api.post(`/tickets/refund/approve/${refundRequestId}`),
};

export default api;
