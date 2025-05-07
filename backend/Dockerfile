FROM node:16.10.0
WORKDIR /app
COPY package*.json ./
RUN npm ci           # Installation stricte des dépendances
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]