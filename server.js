'use strict';

//Express setup
const express = require('express')
const app = express()

//Bodyparser setup
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//DB setup
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:')

//Passport setup
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new LocalStrategy((username, password, done) => {
  db.serialize(() => {
    db.get("SELECT * FROM user WHERE username = ?", username, (err, user) => {
      if(err)
        return done(err, false);
      if(!user)
        return done(null, false, { message: 'Incorrect username.' });
      if(user.password != password)
        return done(null, false, { message: 'Incorrect password.' });
      return done(null, user)
    })
  })
}))

//Morgan setup for logging requests
var morgan = require('morgan')
app.use(morgan('dev'))

//DB create tables and fill in some testdata
db.serialize(function() {
  db.run("CREATE TABLE task(id INTEGER PRIMARY KEY, text TEXT, completed BOOLEAN)");
  db.run("CREATE TABLE user(username TEXT PRIMARY KEY, password TEXT)");

  db.run("INSERT INTO user(username, password) VALUES(\'testuser\', \'pw123\')");
  db.run("INSERT INTO user(username, password) VALUES(\'testuser2\', \'pw123\')");

  db.run("INSERT INTO task(id, text, completed) VALUES(NULL, \'testTask1\', 0)");
  db.run("INSERT INTO task(id, text, completed) VALUES(NULL, \'testTask2\', 0)");
  db.run("INSERT INTO task(id, text, completed) VALUES(NULL, \'testTask3\', 0)");
});

app.listen(3001, function () {
  console.log('Listening on port 3001!');
});

//Get all tasks
app.get('/tasks', function (req, res) {
  db.all('SELECT * FROM task', function (err, rows) {
    if (err) {
      res.send(err.message);
    } else {
      // setTimeout(5000);
      res.send(rows);
    }
  });
});

//Get task by ID
app.get('/tasks/:id', function (req, res) {
  let id = req.params.id;
  db.get('SELECT * FROM task WHERE id = ?', id, function (err, row) {
    if (err) {
      res.send(err.message);
    } else {
      res.send(row);
    }
  });
});

//Create a task
app.post('/tasks', function (req, res) {

  let text = req.body.text;

  db.serialize(function() {
    db.run("INSERT INTO task(id, text, completed) VALUES(NULL, ?, ?)", text, false, function(err) {
      if(!err){
        res.status(201).json({
          id: this.lastID,
          text: text,
          completed: false
        });
      }else {
        console.log("Error while adding new task!");
      }
    });
  });
});

//Delete a task
app.delete('/tasks', function (req, res) {

  let id = req.body.id;

  db.serialize(function() {
    db.run("DELETE FROM task WHERE rowid = ?", id, function (err) {
      if(err){
        console.log("Error while deleting task!");
      }else{
        res.sendStatus(204);
      }
    });
  });
});

//Update a task
app.put('/tasks', function (req, res) {

  let id = req.body.id;
  let text = req.body.text;
  let completed = req.body.completed;

  db.serialize(function() {
    db.run('UPDATE task SET text = ?, completed = ? WHERE rowid= ?', text, completed, id, function (err) {
      if(err){
        console.log("Error while updating task!");
      }else{
        res.sendStatus(200);
      }
    });
  });
});

//Get all users
app.get('/users', function (req, res) {
  db.all('SELECT * FROM user', function (err, rows) {
    if (err) {
      res.send(err.message);
    } else {
      res.send(rows);
    }
  });
});

//Get user by username
app.get('/users/:username', function (req, res) {
  let username = req.params.username;
  db.get('SELECT * FROM user WHERE username = ?', username, function (err, row) {
    if (err) {
      res.send(err.message);
    } else {
      res.send(row);
    }
  });
});

//Login as a registered user
app.post('/login', passport.authenticate('local'), function (req, res) {
  console.log("User logged in");
  res.json({ success: true, user: req.body.username });
});

//Register new user
app.post('/register', function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  if(!username || !password) {
    res.json({ success: false, message: 'Please enter username and password to register.' });
  } else {
    // TODO Create and save user
  }
});
