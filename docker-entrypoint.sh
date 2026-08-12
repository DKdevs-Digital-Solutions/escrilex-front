#!/bin/sh
set -e

if [ -z "${API_URL}" ]; then
  echo "ERRO: variavel de ambiente API_URL nao definida (ex.: https://api.escrilex.app.br)" >&2
  exit 1
fi

rm -rf /usr/share/nginx/html
cp -r /usr/share/nginx/html-template /usr/share/nginx/html

find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) \
  -exec sed -i "s|__RUNTIME_API_URL__|${API_URL}|g" {} +

echo "front configurado com API_URL=${API_URL}"

exec "$@"
