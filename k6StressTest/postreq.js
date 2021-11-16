/* eslint-disable camelcase */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      rate: 100, // 100 RPS, since timeUnit is the default 1s
      duration: '1m',
      preAllocatedVUs: 1,
      maxVUs: 10,
    },
  },
};
export default function () {
  const url = 'http://localhost:8080/reviews1';
  const payload = JSON.stringify({
    product_id: Math.floor(Math.random() * (1000000 - 900000) + 900000),
    rating: 4,
    summary: 'This is a stress test!',
    body: 'Oh! What a stressful test it is for K6. Why did you force me to do stress test. I would like to have a cool aid',
    recommended: 'yes',
    name: 'johnny',
    email: 'johndoe@example.com',
    photos: [],
    characteristics: {
      fit: 2,
      size: 3
    }

  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}

