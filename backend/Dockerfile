FROM node:16.10.0
WORKDIR /app
COPY package*.json ./
RUN npm ci         
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]