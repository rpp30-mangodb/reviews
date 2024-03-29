import http from 'k6/http';
import { sleep, check } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

//last product_id: 1,000,011
//test for last 100 (99,900 - 1,000,000)
//average 1uvs - 1s

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

// eslint-disable-next-line func-style
export default function () {
  // for (let id = 99950; id <= 1000000; id++) {
  const min = 900550;
  const max = 1000000;
  const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  const id = getRandomArbitrary(min, max);
  const resp = http.batch([
    ['GET', `http://localhost:8080/reviews/meta/?product_id=${id}` ],
    ['GET', `http://localhost:8080/reviews/?product_id=${id}`],
  ]);

  check(resp[0], {
    'main page status was 200': (res) => res.status === 200,
  });
  sleep(1);
}

// }

// export default function () {
//   for (let id = 99900; id <= 99950; id++) {
//     http.get(`http://localhost:8080/reviews/?product_id=${id}`);
//     sleep(10);
//   }
// }
// export function handleSummary(data) {
//   return {
//     'summary.html': htmlReport(data),
//   };
// }

// import http from 'k6/http';
// import k6example from 'https://raw.githubusercontent.com/loadimpact/k6/master/samples/thresholds_readme_example.js';
// export default k6example; // use some predefined example to generate some data
// export const options = { vus: 5, iterations: 10 };

// // These are still very much WIP and untested, but you can use them as is or write your own!
// import { jUnit, textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// export function handleSummary(data) {
//   console.log('Preparing the end-of-test summary...');

//   // Send the results to some remote server or trigger a hook
//   const resp = http.post('https://httpbin.test.k6.io/anything', JSON.stringify(data));
//   if (resp.status != 200) {
//     console.error('Could not send summary, got status ' + resp.status);
//   }

//   return {
//     'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout...
//     '../path/to/junit.xml': jUnit(data), // but also transform it and save it as a JUnit XML...
//     'other/path/to/summary.json': JSON.stringify(data), // and a JSON with all the details...
//     // And any other JS transformation of the data you can think of,
//     // you can write your own JS helpers to transform the summary data however you like!
//   };
// }

