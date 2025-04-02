From node:18-alpine as base

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

CMD npm run dev

EXPOSE 3000