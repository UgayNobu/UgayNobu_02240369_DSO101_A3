FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NEXT_PUBLIC_API_URL=https://be-todo-a3.onrender.com
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]