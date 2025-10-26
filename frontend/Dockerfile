# ========= BUILD STAGE =========
FROM node:18-alpine AS build

WORKDIR /app

# 1) Copia apenas manifestos para aproveitar cache
COPY package*.json ./

# 2) Instala dependências (inclui devDependencies -> necessário para @tailwindcss/cli)
#    Se você usa package-lock.json, prefira npm ci (mais reprodutível).
#    Caso não tenha package-lock.json no repo, troque para "npm install".
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# 3) Copia o restante do código
COPY . .

# 4) Build (scripts prebuild/prestart do Tailwind v4 irão gerar src/index.css)
RUN npm run build

# ========= RUNTIME STAGE =========
FROM nginx:alpine

# Copia artefatos estáticos do build
COPY --from=build /app/build /usr/share/nginx/html

# Sua config de Nginx (reverse proxy / history fallback etc.)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
