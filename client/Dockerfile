FROM node:carbon-alpine as builder

WORKDIR /food-app-client

COPY package.json .

RUN npm install

COPY . .

RUN npm run lint
RUN npm run test -- --coverage
RUN npm run build

FROM nginx:alpine as final

COPY --from=builder /food-app-client/dist /usr/share/nginx/html