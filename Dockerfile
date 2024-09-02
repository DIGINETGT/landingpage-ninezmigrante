FROM node:20-alpine3.20

WORKDIR /usr/src/app

COPY package-lock.json ./
COPY package.json ./

# ENV VITE_APP_GOOGLE_RECAPTCHA_KEY=6Ld_LJcgAAAAAOILele8n-ocGc738mu0APQDJJp8
# ENV VITE_APP_API_URL=/api/v1
# ENV VITE_APP_BASENAME=/
# ENV PUBLIC_URL=/

# RUN npm install -D vite

RUN npm install
# RUN npm i framer-motion
# RUN npm install -g serve

COPY . .

# RUN npm run dev

# EXPOSE 3001

# CMD ["serve", "-l", "3001", "-s", "dist"] 