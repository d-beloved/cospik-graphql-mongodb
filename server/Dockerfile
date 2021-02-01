FROM node:12
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
RUN yarn remove bcrypt && yarn add bcrypt
COPY . .
EXPOSE 3110
CMD ["yarn", "start"]