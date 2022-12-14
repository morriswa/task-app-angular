#stage 1
FROM --platform=x86-64 node:latest as node
WORKDIR /app
COPY ./src /app/src/
COPY *.json /app/
COPY README.md /app/
RUN npm install
RUN npm run build --prod
#stage 2
FROM --platform=x86-64 nginx:alpine
COPY --from=node /app/dist/task-app-ng /usr/share/nginx/html