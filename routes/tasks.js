var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://yogesh:yogi1234@ds161209.mlab.com:61209/crud_yogesh', ['tasks'])

//Get all tasks
router.get('/tasks', function(req, res, next){
  db.tasks.find(function(err, tasks){
    if(err){
        res.send(err);
    }
    res.json(tasks);
  })
});

module.exports = router;

//Get single tasks
router.get('/task/:id', function(req, res, next){
  db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
    if(err){
        res.send(err);
    }
    res.json(task);
  })
});

module.exports = router;

//Save the task
router.post('/task', function(req, res, next){
  var task = req.body;
  if(!task.title || (task.isDone + '')){
    res.status(400);
    res.json({
      "error":"Bad data"
    });
  }
  else {
    db.tasks.save(task, function(err, task){
      if(err){
        res.send(err);
      }
      res.json(task);
    });
  }
});

//Delete task
router.delete('/task/:id', function(req, res, next){
  db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
    if(err){
        res.send(err);
    }
    res.json(task);
  })
});

//Update task
router.put('/task/:id', function(req, res, next){
  var task = req.body;
  var updTask = {};

  if(task.isDone){
    updTask.isDone = task.isDone;
  }

  if(task.title){
    updTask.title = task.title;
  }

  if(!updTask){
    res.status(400);
    res.json({
      "error":"Bad Data"
    });
  } else {
    router.update('/task/:id', function(req, res, next){
      db.tasks.remove({_id: mongojs.ObjectId(req.params.id)},updTask,{}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
      })
    });
  }
});



module.exports = router;
