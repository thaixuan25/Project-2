import http from 'k6/http';
import { check } from 'k6';

// Doc tham so tu dong lenh: k6 run -e BASE_URL=... -e RATE=... -e DURATION=... -e ERROR_RATE=...
const BASE_URL = __ENV.BASE_URL || 'http://localhost';
const RATE = Number(__ENV.RATE || 20);
const ERROR_RATE = Number(__ENV.ERROR_RATE || 0);

export const options = {
  scenarios: {
    tai_on_dinh: {
      executor: 'constant-arrival-rate',
      rate: RATE,
      timeUnit: '1s',
      duration: __ENV.DURATION || '5m',
      preAllocatedVUs: 10,
      maxVUs: 50,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  if (Math.random() < ERROR_RATE) {
    http.get(`${BASE_URL}/status/500`, { tags: { loai: 'loi_co_y' } });
    return;
  }
  const res = http.get(`${BASE_URL}/`);
  check(res, { 'tra ve 200': (r) => r.status === 200 });
}