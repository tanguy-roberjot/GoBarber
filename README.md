<h1 align="center">GoBarber
</h1>

<h4 align="center">
  🚀 GoStack 2020 bootcamp - RocketSeat
</h4>
<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/tanguy-roberjot/GoBarber">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/tanguy-roberjot/GoBarber">
  
  <a href="https://github.com/tanguy-roberjot/GoBarber/commits/main">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/tanguy-roberjot/GoBarber">
  </a>

  <a href="https://github.com/tanguy-roberjot/GoBarber/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/tanguy-roberjot/GoBarber">
  </a>

</p>

<p align="center">
  <img alt="Frontend" src=".github/GoBarber.png" width="100%">
</p>

## Used technologies

This project was developed using typescript with the following technologies/tools :

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/en)
- [React](https://reactjs.org)
- [React Native](https://facebook.github.io/react-native/)
- [Mongodb](https://www.mongodb.com)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [TypeORM](https://typeorm.io/)
- [Jest](https://jestjs.io/)
- [Amazon S3](https://aws.amazon.com/s3)
- [Amazon SES](https://aws.amazon.com/ses)


## 💻 Project

GoBarber is a project that was developed to simplify scheduling in a barber shop, both for the customer and the barber.

The Web side was designed for the barber. He can sign up, sign in, update his profile and check his next appointment and schedule for the day of his choice.

The Mobile App was designed for the customer to schedule his haircut with the barber of his choice, showing him the available slots for the selected day. 

This project uses Ethereal as a development mail provider but is also Amazon SES ready (see configuration below). It also uses DiskStorage as a development storage provider but is Amazon S3 ready.

## Installation


### Clone

- Clone this repo to your local machine using `git clone https://github.com/tanguy-roberjot/GoBarber.git`

### Setup


> run databases docker containers (PostgreSQL, Mongo and Redis).
> Warning: if you use different port, database name or password, you'll need to change back-end ormconfig.json and/or .env

```shell
$ docker run --name go-barber-postgres -e POSTGRESS_PASSWORD=docker -p 5432:5432 -d postgres
$ docker run --name go-barber-mongo -p 27017:27017 -d -t mongo
$ docker run --name go-barber-redis -p 6379:6379 -d -t redis:alpine
```
> Enter the back-end folder, install dependencies using yarn, then run it:

```shell
$ cd GoBarber/back-end
$ yarn install
$ yarn dev:server
```
> Enter the front-end folder, install dependencies using yarn, then run it:

```shell
$ cd GoBarber/front-end
$ yarn install
$ yarn start
```

> Enter the mobile folder, install dependencies using yarn, then run it:

```shell
$ cd GoBarber/mobile
$ yarn install
$ yarn start
```

```shell
$ yarn android
or
$ cd ios && pod install & cd ..
$ yarn ios
```

### Amazon SES Setup

> To use Amazon Simple Email Service as the email provider, first configure your amazon account, then, in the back-end .env, change from :

```shell
MAIL_DRIVER=ethereal
# AWS_ACCES_KEY_ID=
# AWS_SECRET_KEY_ID=
# AWS_DEFAULT_REGION=
```
> To  :
```shell
MAIL_DRIVER=ses
AWS_ACCES_KEY_ID=YOUR_AWS_KEY
AWS_SECRET_KEY_ID=YOUR_AWS_SECRET
AWS_DEFAULT_REGION=YOUR_AWS_REGION
```

### Amazon S3 Setup

> To use Amazon S3 as the storage provider (for avatar images for now), first configure your amazon account, then, in the back-end .env, change from :

```shell
STORAGE_DRIVER=disk
# AWS_ACCES_KEY_ID=
# AWS_SECRET_KEY_ID=
# AWS_DEFAULT_REGION=
```
> To  :
```shell
STORAGE_DRIVER=s3
AWS_ACCES_KEY_ID=YOUR_AWS_KEY
AWS_SECRET_KEY_ID=YOUR_AWS_SECRET
AWS_DEFAULT_REGION=YOUR_AWS_REGION
```
## Contributing

> To get started...

### Step 1

- **Option 1**
    - Fork this repo!

- **Option 2**
    - Clone this repo to your local machine using `git clone https://github.com/tanguy-roberjot/GoBarber.git`

### Step 2

- **HACK AWAY!** 🔨🔨🔨

### Step 3

- 🔃 Create a new pull request using <a href="https://github.com/tanguy-roberjot/aws-amplify-authentication-react-native/compare/" target="_blank">`https://github.com/tanguy-roberjot/GoBarber/compare/`</a>.

---

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**





---

Tanguy Roberjot
