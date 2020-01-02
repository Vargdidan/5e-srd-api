const express = require('express');
const router = express.Router();
const utility = require('./utility');
const Model = require('../models/class');

router
.get('/', (req,res) => {
  Model.find((err,_data) => {
    if (err) {
      res.send(err);
    }
  }).sort( { index: 'asc'} ).exec( (err, data) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(utility.NamedAPIResource(data));
  });
});



router
.get('/:index', (req,res) => {
  // search by race
  if (utility.isClassName(req.params.index) === true) {
    Model.findOne( { 'name': utility.upperFirst(req.params.index) }, (err,_data) => {
      if (err) {
        res.send(err);
      }
    }).sort( {url: 'asc', level: 'asc'} ).exec((err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(data);
    })
  }

  else { // return specific document
    Model.findOne( { index: parseInt(req.params.index) }, (err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(data);
    })
  }
})

const levelRouter = express.Router({mergeParams: true});
router.use('/:index/level', levelRouter);
const LevelModel = require('../models/level');

levelRouter
.get('/:level', (req, res) => {

  console.log(req.params.index);

  if (typeof(parseInt(req.params.level)) == 'number') {


    let urlString = "http://www.dnd5eapi.co/api/classes/" + req.params.index + "/level/" + req.params.level;
    console.log(urlString);

    LevelModel.findOne({'url': urlString}, (err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(data);
    })
  } else {
      res.status(404)
  }
})

// TODO: Is a second necessary?
const levelRouter2 = express.Router({mergeParams: true});
router.use('/:index/levels', levelRouter2);

levelRouter2
.get('/', (req, res) => {
    console.log(utility.class_map[req.params.index]);
    LevelModel.find({'class.name': utility.class_map[req.params.index], 'subclass' : {}}, (err, _data) => {
      if (err) {
        res.send(err);
      }
    }).sort( {level: 'asc'} ).exec((err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(data);
    })

})
module.exports = router;
