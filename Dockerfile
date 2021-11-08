FROM node:latest



WORKDIR /reviews
COPY package.json .
RUN npm install
COPY . .

CMD npm start

