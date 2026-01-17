FROM node:24-alpine AS build
WORKDIR /usr/src/app
EXPOSE 80
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -c production
FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf