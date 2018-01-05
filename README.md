# Домашнее задание курса Node.js (3 и 4)
![Скриншот проекта](https://loftschool.com/uploads/course_logos/nodejs.svg?v=1513152963369)

>Для запуска:

0. git clone https://bitbucket.org/krabaton/node-homework
1. npm i (yarn)
2. gulp


>Для сборки проекта под Express(Koa.js) (папка server):

    gulp build


### Проект состоит из четырех страниц
* index.html
* login.html
* contact-me.html
* my-work.html
> Итоговый url при обращении к странице должен быть без расширения html (пример: localhost/login)
> В сборке используется шаблонизатор PUG, но можно использовать любой другой на стороне сервера.

#### На странице login.html - POST запрос url = '/login'
Отправляется JSON на сервер
```js
    {
      login: 'login',
      password: 'pass'
    }
```
  Ожидается от сервера JSON следующего вида 
  >при ошибке
```js
  { 
    mes: "Логин и/или пароль введены неверно!",
    status: "Error" 
  }
```
>при правильной обработке
```js
  { 
    mes: "Aвторизация успешна!", 
    status: "OK" 
  }
```
***
#### На странице contact-me.html - POST запрос url = '/contact-me'
Отправляется JSON на сервер
```js
    {
      name: 'Имя отправителя',
      email: 'Email пользователя',
      message: 'Сообщение от пользователя'
    }
```
  Ожидается от сервера JSON следующего вида 
  >при ошибке
```js
  { 
    mes: "Описание ошибки",
    status: "Error" 
  }
```
>при правильной обработке
```js
  { 
    mes: "Сообщение отправлено!", 
    status: "OK" 
  }
```
***
#### На странице my-work.html - POST запрос url = '/my-work'
Отправляется FormData объект на сервер с картинкой проекта
```js
    в поле file - Файл картинки проекта
    в поле projectName - Название проекта
    в поле projectUrl - URL проекта
    в поле text - Описание проекта
```
  Ожидается от сервера JSON следующего вида 
  >при ошибке
```js
  { 
    mes: "Описание ошибки",
    status: "Error" 
  }
```
>при правильной обработке
```js
  { 
    mes: "Проект успешно загружен", 
    status: "OK" 
  }
```

##### Домашние задание №3 - реализовать серверную часть на [Express.js](http://expressjs.com/ru/)

##### Домашние задание №4 - реализовать серверную часть на [Koa.js](http://koajs.com/)

Данные хранить на сервере в JSON файле, можно использовать пакет [nconf](https://www.npmjs.com/package/nconf) или [LowDB](https://github.com/typicode/lowdb) на свое усмотрение