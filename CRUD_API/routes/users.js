const express = require('express');
const db = require('../database/mariaDB');
const router = express.Router();
const userController = require('../controllers');
const {User} = require('../models');

function msg(str){
  return '<script type="text/javascript">alert("'+str+'");</script>';
}

function findRender(res, type, DBage, DBname) {
  switch(type){
    case "age":
    User.findAll({
      where: {
        age: DBage
      }
    }).then(result => {
      res.json(result);
    }).catch(error => {
      console.log(error);
    });
    break;

    case "name":
    User.findAll({
      where: {
        name: DBname
      }
    }).then(result => {
      res.json(result);
    }).catch(error => {
      console.log(error);
    });
    break;

    default:
    res.send(msg("Error!!"));
    break;
  }
}

router.get('/', userController.basicAPI);
router.get('/test', userController.testAPI);
router.get('/post_test', userController.postTestAPI);

router.get('/db_view', (req, res, next) => {
  db.getUserList()
  .then((row) => {res.json(row);})
  .catch(error => {console.error(error);});
});


/**
  * @path {GET} http://localhost:[port]/users/db_view/add?name=test&age=1
  * @description Query Params 요청으로 데이터 값이 있는 GET Method
  *
  * 데이터를 생성하는 라우터
  */
router.get('/db_view/add', (req, res, next) => {
  let dbName = req.query.name;
  let dbAge = req.query.age;

  if(!dbName || null || !dbAge) {
    res.send(msg('Params is Null!'));
    return;
  }

  User.create({
    name: dbName,
    age: dbAge
  }).then(result => {
    res.redirect("/users/db_view");
  }).catch(error => {
      res.send(msg('Error!!!'));
  });
});


/**
  * @path {GET} http://localhost:[port]/users/db_view/delete?name=test&age=1
  * @description Query Params 요청으로 데이터 값이 있는 GET Method
  *
  * 데이터를 삭제하는 라우터
  */
router.get('/db_view/delete', (req, res, next) => {
  let dbName = req.query.name;
  let dbAge = req.query.age;

  if(!dbName || null || !dbAge) {
    res.send(msg('Params is Null!'));
    return;
  }

  User.destroy({
    where: {
      name: dbName,
      age: dbAge
    }
  }).then(result => {
    res.redirect("/users/db_view");
  }).catch(error => {
      res.send(msg('Error!!!'));
  });
});


/**
  * @path {GET} http://localhost:[port]/users/db_view/find?age=10
  * or
  * @path {GET} http://localhost:[port]/users/db_view/find?name=abc
  * or
  * @path {GET} http://localhost:[port]/users/db_view/find?name=abc&age=10
  * @description Query Params 요청으로 데이터 값이 있는 GET Method
  *
  * 데이터를 검색하는 라우터
  */
router.get('/db_view/find', (req, res, next) => {
  req.query.name ? findRender(res, "name", req.query.age, req.query.name) : null;
  req.query.age ? findRender(res, "age", req.query.age, req.query.name) : null;
});

router.get('/db_view/edit', (req, res, next) => {
  let dbName = req.query.name;
  let dbAge = req.query.age;

  if(!dbName || null || !dbAge) {
    res.send(msg('Params is Null!'));
    return;
  }

  User.update({
    name: dbName,
    age: dbAge
  },
  {
    where: {
      name: dbName
    }
  }).then(result => {
    res.redirect("/users/db_view");
  }).catch( error => {
    console.log(error);
  });
});

module.exports = router;
