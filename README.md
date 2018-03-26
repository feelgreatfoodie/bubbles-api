# Peppermint Bubbles

Peppermint bubbles is an app that let's you log in with authentication and set a counter for how many Peppermint Bubbles you want.

It is a full-stack CRUD app!

Mostly it is for making a checklist on how to set up the following to Heroku in a two-server configuration

+ PostgreSQL
+ Node.js
+ Express
+ React
+ React router
+ Redux
+ Both OAuth and standard username/password authentication.

You will need to change these for your particular situation, but it is a good starting point.

Also: Note that I am using Node.js 9.8.0 as I write this, and I am using Javascript features all the way up to ES2017. In particular, I am using arrow functions with lots of implied `returns`. So if it looks like `return` is missing check to see if the function is a one-liner or that it is surrounded by `()`.

Also, I avoid using global install of packages, so I use the `npx` command a lot, which runs scripts out of the local `node_modules` directory. If you don't like this and instead use global installs, then don't use `npx`. 

Here we go.

## Prerequisites

Install the following homebrew packages if you don't have them already

+ `heroku`

Install these `npm` packages globally

+ `express-generator`
+ `yarn`
+ `knex`
+ `create-react-app`

## Troubleshooting!

Because troubleshooting is a big deal and I can't possibly think of everything that can go wrong, I don't have troubleshooting steps here.

## Figure out a name for your app

I call this one `peppermint-bubbles`. Because I am using a two server setup for the deployment, this means I have two repositories for this app:

+ `peppermint-bubbles-api`: This the backend of the application, written in Node and Express

+ `perppermint-bubbles-ui`: This is the front end using React and Redux and built with Webpack.

Obviously rename peppermint bubbles with your app name.

## 1. Create your repository for the backend API.

+ Create your repository. Clone it to your local computer.

+ **CHECK YOUR `.gitignore` FILE**. It doesn't matter about the order, but make sure the following lines are in it:

```
.env
.DS_Store
node_modules/
.env
yarn.lock
package-lock.json
```

While it isn't bad practice *per se* to commit the lockfiles, I find they give me problems with Heroku, so I keep them out of the repo.

## 2. Create your Express app with `express-generator`

From the root directory of your repo, run the command:

```
express --view=ejs peppermint-bubbles-api
```

Of course, substitute your app name! Also, this example app won't be using any server side rendering it doesn't matter what view engine you use.

For Heroku to see your app, you will need everything in the root of your repo. So move everything out the directory you just created to the root.

```
mv peppermint-bubbles-api/* .
rm -r peppermint-bubbles-api
```

Look! We got a `package.json` already. We'll be editing `package.json` later!

## Add your new files to the git repo

Now you need to add your files to the git repo.

```
git add app.js bin/ package.json public/ routes/ views/
git commit -a -m 'Express app generated'
```

## *OPTIONAL*: Copy `.eslintrc` into the root of your directory.

Now copy your `.eslintrc` file into the root of your repository. I always keep a specific copy of `.eslintrc` in each project. If you don't, that's fine to skip this step. But you can always copy the `.eslintrc` out of this repo.

If you do this, make sure you run the following commands:

```
git add .eslintrc
git commit .eslintrc -m 'eslint file'
```

Then get `eslint` into your project with

```
npm install --save-dev eslint
```

## Push!

Now that you have added all the files, push to your repository.

## Install the packages and do a test launch!

```
npm install
npm start
```

### [http://localhost:3000](http://localhost:3000)

You should see welcome to express! If not trouble shoot that. If it works, kill the `npm start` process with Ctrl-C.

## Change the port for the backend to 8181

Since you will be running two servers at once, take this opportunity to change the port number. Locate `bin/www` and change the line `var port = normalizePort(process.env.PORT || '3000');` to be:

```javascript
var port = normalizePort(process.env.PORT || '8181');
```

Now run `npm start` again and go to:

### [http://localhost:8181](http://localhost:8181)

*Why did I change the port?* This is because I will run a second server on port 3000 on my local development machine that will serve the react app.

## 3. Change the default views to JSON

Since we are just going to be rendering our data as JSON, change to just return the JSON on the index route. So find the following in `routes/index.js`

```javascript
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
```

And change it to:

```javascript
router.get('/', function(req, res, next) {
  res.json({ hello: 'world' });
});
```

Of course, from here on out, make all your code compliant with your linter.

## 4. Database, Part 1: The `users` table.

The most basic thing your app can have is users. This is for two reasons:

+ Your people can sign into your app and keep their information personalized the way they want it.

+ You want to track individual users so you can stalk them with creepy ML algorithms. Hey, I don't judge--in fact, I say, the creepier the better!

### 4a. Schema for the `users` table

1. `id`: Primary key
2. `email`: The email address of the user which we will use as their username.
3. `password`: A **HASHED NON-CLEAR TEXT VERSION OF THEIR PASSWORD**.
4. `is_admin`: True is they have access to all the user's data on the system. False if not.

Columns 1, 2, 3 are authentication. Column 4 is for authorization.

*NOTE for this first step of our database:* We aren't adding password security yet because that will require significant setup. But it is crucial--we'll be swinging back around to it later.

### 4b. Create the database

Simple. On the command line, type:

```
createdb pprmntbbls
```

Possible error: Hopefully this won't happen to you

```
createdb: could not connect to database template1: could not connect to server: No such file or directory
	Is the server running locally and accepting
	connections on Unix domain socket "/tmp/.s.PGSQL.5432"?
```

That means that your database isn't running. If you're on macOS system and installed with homebrew, type the command `pg_ctl -D /usr/local/var/postgres start` to start PostgreSQL.

### 4c. Setting up `knex`

`knex` is a SQL query builder that lets you use relational databases with your Express app. In this case we will be using it with PostgreSQL.

First, install the packages:

```
npm install --save knex pg
```
Now create two files in the root of your repo

#### `knexfile.js`

```javascript
module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/pprmntbbls'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
}
```

Since you are probably not making the Peppermint Bubbles app, change the DB name from `pprmntbbls`. That file tells `knex` how to connect to your database.

#### 4d. `knex.js`

```javascript
const environment = process.env.NODE_ENV || 'development'
const knexConfig = require('./knexfile')[environment]
const knex = require('knex')(knexConfig)
module.exports = knex
```

That file detects whether you are in a development environment (the computer you use for development work) or a production environment (Heroku, etc).

### Creating migrations

Migrations are how we make our schema. They tell `knex` to issues `CREATE TABLE` and `ALTER TABLE` commands to PostgreSQL.

Let's start with our users. We will tell `knex` to make a migration file for our users. Type the command:

```
npx knex migrate:make users
```

This will create a directory and file named similarly to the following: `migrations/20180325215736_users.js`. The long number is the Unix timestamp. It is crucial that you do not change this number. Your number will be different.

Add the file to the repo with a command like the following (you will need to substitute your file name here): `git add migrations/20180325215736_users.js`

Now look into the file you just made. It should look something like this:

```javascript
exports.up = function(knex, Promise) {
  
};

exports.down = function(knex, Promise) {
  
};
```

The `exports.up` function is what creates (or alters) your table and `exports.down` drops (or reverses the alterations to) your table. Let's fill it in with some meaningful stuff:

```javascript
exports.up = (knex, Promise) => (
  knex.schema.createTable('users', (table) => {
    table.increments()
    table.varchar('name', 256)
    table.varchar('password', 256)
    table.boolean('is_admin')
  })
)

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('users')
```

Run the following command:

```
npx knex migrate:latest
```

That will run all the migrations that you have.

Important side note: you can reverse migrations with `npx knex migrate:rollback`

### Creating seeds

What good is a table with nothing in it? Let's put some data in our table.

*Note that since we are not doing password security I am not encrypting the password field for now.* This will be fixed later.

Run this command:

``` 
npx knex seed:make 001_users
```

This tells `knex` to create a seed file so that we can create initial data. I prefixed the name of the table with `001_`. Why? numbering our seeds guarantees that they will run in the same order every time. You need to left pad the numbers with zeros to make this work! Review sorting of strings to understand why.

Now we have an empty seed file:

```javascript
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {id: 1, colName: 'rowValue1'},
        {id: 2, colName: 'rowValue2'},
        {id: 3, colName: 'rowValue3'}
      ]);
    });
};
```

Add this file to your repo. Then put something useful into it.

```javascript
exports.seed = (knex, Promise) => (
  knex('users').del()
    .then(() => (
      knex('users').insert([
        {id: 1, name: 'hello@me.com', password: 'thereaintnopassword', is_admin: true}
      ])
    ))
    .then(() => knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"))
)
```

That made one new row in the database table! You can verify this with `psql` if you want.

## 5. Create our first `GET` route that uses a database

Now that we have a list of users, let's get some way to list them. Clearly, this isn't something that we want in production, but it gives us a chance to make sure our database is connected correctly.

Naturally, if we want CRUD operations on the `users` table, we should put it on the `/users/` URL path. This means that we are going to use the route in `routes/users.js`

### 5a. `routes/users.js`

This is what the express generator created for us:

```javascript
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
```

Change the whole file to:

```javascript
const express = require('express')
const router = express.Router()
const knex = require('../knex')

/* GET users listing. */
router.get('/', (req, res, next) => {
  knex('users')
    .select('name')
    .then((rows) => res.json(rows))
})

module.exports = router
```

I won't explain every line because you already know how to use `knex`. The key thing here is the line `const knex = require('../knex')` which is what allows us to create our knex queries.

*WHAT WE DID THERE IS HORRIBLY INSECURE* We shouldn't let unauthenticated users see the users table.

So why did I do it? I wanted to make sure that I could get database connectivity working early, because if there was a problem, it would be better to fix it early.

## 6. First test deployment to Heroku

*NEVER* wait until your project deadline to test deployment. Deploy early an often, even if your project is not complete, so you can take care of problems as they arise.

If you don't have the Heroku CLI installed type `brew install heroku` and then you are good to go.

### 6a. Setup files in your repo for Heroku.

Tell Heroku which version of node to use. First, find out the version of node that you are running byt typing the following on the command prompt:

```
node --version
```

My node version is `v9.8.0` as of the time of this writing.

Add this as an engine key to `package.json`:

```
"engines": {
  "node": "v9.8.0"
}
```

Now you need to have a `start` script in your `package.json`, under the object in the `scripts` key:

``` 
“start”: “node ./bin/www”
```

You will also need another Heroku-specific script in `package.json`

``` 
"heroku-postbuild": "knex migrate:rollback; knex migrate:latest; knex seed:run;"
```

So your `package.json` will look like this:

```json
{
  "name": "peppermint-bubbles-api",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www",
    "heroku-postbuild": "knex migrate:rollback; knex migrate:latest; knex seed:run;"
  },
  "dependencies": {
    "cookie-parser": "~1.4.3",
    "debug": "~2.6.9",
    "ejs": "~2.5.7",
    "express": "~4.16.0",
    "http-errors": "~1.6.2",
    "knex": "^0.14.4",
    "morgan": "~1.9.0",
    "pg": "^7.4.1"
  },
  "devDependencies": {
    "eslint": "^4.19.1"
  },
  "engines": {
    "node": "v9.8.0"
  }
}
```

Your versions of packages will probably look different though.

Now you need a `Procfile` put this at the *root* of your repo. This tells Heroku how to start the application.

```
echo ‘web: node ./bin/www’ > Procfile
```

Make sure to add your `Procfile` to your repo with `git add Procfile`

Now commit all your changes, and make sure they are all committed to the `master` branch.

### 6b. Set up your new app on Heroku

6b1. Log in to Heroku

```
heroku login
```

6b2. Then create an app with your desired app name. In this I type

```
heroku create bubbles-api
```

6b3. Enable support for PostgreSQL

```
heroku addons:create heroku-postgresql
```

6b4. Now add the Heroku git remote to your project:

```
heroku git:remote -a bubbles-api
```

6b5. Now push your project to Heroku

```
git push heroku master
```

6b6. Test your app. Once again, this depends on the app name but I am going to use cURL to test both REST endpoints I have so far.

```
curl -X GET https://bubbles-api.herokuapp.com
```

```
curl -X GET https://bubbles-api.herokuapp.com/users
```

You could use `heroku open`, but since this is just a REST API that returns only JSON, testing it from the command line works just as well. You can use the REST testing tool of your choice.
