FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build 

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm ci --only=production 

COPY --from=build /app/src ./src
COPY --from=build /app/index.js ./

EXPOSE 8000

CMD ["node", "index.js"]


