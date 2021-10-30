import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/2.3.1/dist/bundle.js';
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
      duration: '1.5m',
      preAllocatedVUs: 50,
      maxVUs: 100,
    },
  },
};

// eslint-disable-next-line func-style
export default function handleSummary (data) {
  for (let id = 99920; id <= 1000011; id++) {
    const resp = http.get(`http://localhost:8080/reviews/?product_id=${id}`, JSON.stringify(data));

    if (resp.status !== 200) {
      console.error('Could not send summary, got status ' + resp.status);
    }
  }
  return {
    'summary.html': htmlReport(data),
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

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

