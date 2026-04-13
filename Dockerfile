# Imagen base de Node.js liviana
FROM node:22-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar primero los archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código
COPY . .

# Puerto que expone el contenedor
EXPOSE 3004

# Comando para arrancar
CMD ["node", "server.js"]