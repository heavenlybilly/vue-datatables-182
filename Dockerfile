FROM node:20-alpine

WORKDIR /app

EXPOSE 5173

CMD ["tail", "-f", "/dev/null"]
