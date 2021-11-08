import http from 'k6/http';
import { check, sleep } from 'k6';
export const options = {
  stages: [
    { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: '15m', target: 100 }, // stay at 100 users for 10 minutes
    { duration: '10m', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s

  },
};


export default function () {
  for (let id = 900550; id <= 1000000; id++) {
    const resp = http.batch([
      ['GET', `http://localhost:8080/reviews/meta/?product_id=${id}` ],
      ['GET', `http://localhost:8080/reviews/?product_id=${id}`]
    ]);

    // if (resp[0].status !== 200 || resp[1].status !== 200) {
    //   console.log('response->', resp[0].status, resp[0].url, 'AND', resp[1].status, resp[1].body, 'id', id);
    // }
    // if (resp.status !== 200) {
    //   console.error('Error' + resp.status, 'product_id', id);
    // }
    check(resp[0], {
      'main page status was 200': (res) => res.status === 200,
    });
    sleep(1);
  }

}