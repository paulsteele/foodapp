#Base Image
FROM node:carbon-alpine as base
WORKDIR /food-app
COPY package.json .

#Builder Image
FROM base as builder
RUN npm install --only=production
RUN cp -R node_modules prod_node_modules
RUN npm install
COPY . .
RUN npm run build

#Test Image
FROM builder as test
RUN npm run lint && npm run test

#Release Image
FROM base as release 
COPY --from=builder /food-app/prod_node_modules ./node_modules
COPY --from=builder /food-app/dist ./dist

ENTRYPOINT [ "node", "dist/app.js" ]