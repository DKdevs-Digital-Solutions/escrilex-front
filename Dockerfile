FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# O Vite injeta VITE_* em tempo de build. Buildamos com um sentinela e o
# entrypoint troca pelo valor real de API_URL quando o container sobe, para
# que a URL da API continue configurável pelo Portainer.
ENV VITE_API_URL=__RUNTIME_API_URL__
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Guardamos o build intocado: o entrypoint recria o html a cada start, então
# trocar API_URL e reiniciar o container é suficiente.
COPY --from=build /app/dist /usr/share/nginx/html-template

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
