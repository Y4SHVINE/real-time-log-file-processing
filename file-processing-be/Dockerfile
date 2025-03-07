FROM node:22
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# Install nodemon globally
RUN npm install -g nodemon

CMD ["nodemon", "--legacy-watch", "server.ts"]