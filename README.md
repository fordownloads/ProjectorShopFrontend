# Дипломный проект

Разработка  информационной системы «Продажа проекторов» на платформе .NET 6.0 с микросервисами и Android при использовании Visual Studio 2022.

**Репозиторий с фронтендом Vue 3 (Web/Android)**

## Запуск проекта

1. Переименуйте .env.template в .env
2. Запустите:
```sh
npm install
npm run dev
```

## Публикация для nginx/Android

```sh
npm run build
```
Файлы из ./dist положить в папку, которая указана как root в nginx (/var/www/html/)

Перед сборкой "приложения" на Android, скопировать все из папки ./dist в папку ./app/src/main/assets/

## Конфиг .env

**VITE_API_URL**=string - путь к API

**VITE_APP_NAME**=string - название приложения

**VITE_MOBILE_APP_BOTTOM_TEXT**=string - текст в меню аккаунта в мобильном приложении


## Конфиг nginx

`server {...`

```
location / {
    try_files $uri $uri/ /index.html =404;
}
```

`...}`