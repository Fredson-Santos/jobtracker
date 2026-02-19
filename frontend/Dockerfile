# Build
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

EXPOSE 8016

CMD ["npm", "run", "preview", "--", "--port", "8016", "--host"]
