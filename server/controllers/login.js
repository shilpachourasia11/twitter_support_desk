var rp = require('request-promise');
var db=require('./../sqldb');

exports.login = function(req, res) {
  let userDetail = db.user_detail;
  userDetail.findOne({ where: {
    username: req.body.email,
    password: req.body.password
  }})
  .then((result)=> {
    res.send({
      value: result,
      error: false,
      logged_in: true
    });
  })
};

exports.signUp = function(req, res) {
  let userDetail = db.user_detail;
  findUserByUsername(req.body.email)
  .then((result)=>{
    if(result === null){
      userDetail.create({ username: req.body.email, password: req.body.password })
      .then((result)=>{
        res.send({
          value: result,
          error: false,
          logged_in: true
        });
      })
    }
    else{
      res.send({
        value: 'Username already exixts',
        error: true
      });
    }
  })
};

let findUserByUsername = (username) => {
  let userDetail = db.user_detail;
  return userDetail.findOne({ where: {username: username}});
}
