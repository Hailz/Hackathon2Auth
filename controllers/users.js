var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) return res.status(500).send(err);
      return res.send(users);
    });
  })
  .post(function(req, res) {
    // find the user first in case the email already exists
    User.findOne({ email: req.body.email }, function(err, user) {
      if (user) return res.status(400).send({ message: 'Email already exists' });

      User.create(req.body, function(err, user) {
        if (err) return res.status(500).send(err);
        return res.send(user);
      });
    });
  });

router.get('/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.status(500).send(err);
    return res.send(user);
  });
});

router.put('/:id', function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body, function(err){
      if (err) return res.status(500).send(err);
      return res.send({message: 'Updated account!'});
    });
  });
router.delete('/:id', function(req, res){
  User.findByIdAndRemove(req.params.id, function(err){
    if (err) return res.status(500).send(err);
    return res.send({message: 'Success'});
  })
})

module.exports = router;