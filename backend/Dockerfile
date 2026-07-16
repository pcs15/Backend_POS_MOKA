# Gunakan Node.js versi 20 yang ringan
FROM node:20-alpine

# Buat folder kerja di dalam container
WORKDIR /app

# Copy package.json dan install dependency
COPY package*.json ./
RUN npm install

# Copy seluruh file backend
COPY . .

# Ekspos port 5000 (port yang digunakan server.js)
EXPOSE 5000

# Perintah yang dijalankan saat container menyala
CMD ["npm", "start"]
