
FROM node:13
COPY package*.json /app/
WORKDIR /app/
RUN npm install

# COPY package*.json ./
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]