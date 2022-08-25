FROM node:11
WORKDIR /app

COPY ServerJson ServerJson/
COPY src src/
COPY package.json bower.json db.json gulpfile.js preview.png entrypoint.sh ./

RUN npm install --omit=dev -g  bower gulp json-server@0.16.3
RUN bower install --allow-root
RUN npm install 

EXPOSE 8000

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

