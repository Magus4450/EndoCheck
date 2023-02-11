FROM node:18.14.0-alpine3.16

WORKDIR /frontend

COPY . .

RUN npm install


EXPOSE 5173

CMD ["npm", "run", "dev"]