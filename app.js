var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp',['users']);
var ObjectId = mongojs.ObjectId;
var app = express();
/*Middle ware
var logger = function(req,res,next){
    console.log('logging');
    next();
}

app.use(logger);
*/

//View Engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
//Body parser middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Middle ware for Static files
//Set static path 
app.use(express.static(path.join(__dirname,'public')));
//Global Vars
app.use(function(req,res,next){
    res.locals.errors = null;
    next();
});
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.get('/',function(req,res){
    db.users.find(function(err,docs){
        //console.log(docs);
        res.render('index',{
        title: 'Customer',
        users: docs
        });
    });
});

app.post('/users/add', function(req,res){
    //console.log('FORM Submitted!!')
    //console.log(req.body.first_name);

    req.checkBody('first_name','First Name is Required').notEmpty();
    req.checkBody('last_name','Last Name is Required').notEmpty();
    req.checkBody('email','Email is Required').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        console.log('ERRORS');
        res.render('index',{
                title: 'Customers',
                users: users,
                errors: errors
        });
    }else{
        console.log('Success');
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
        //console.log(newUser);
        db.users.insert(newUser, function(err,result){
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });
    }
})
app.delete('/users/delete/:id',function(req,res){
    //console.log(req.params.id);
    db.users.remove({_id: ObjectId(req.params.id)},function(err,result){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});
app.listen(3000, function(){
    console.log('server started at 3000');
})
/*
var users = [
    {
        id: 1,
        first_name: 'Azim',
        last_name: 'Shaik',
        email: 'ashaik1@kent.edu'
    },
    {
        id: 2,
        first_name: 'Abid',
        last_name: 'Shaik',
        email: 'ashaik2@kent.edu'
    },
    {
        id: 1,
        first_name: 'Ameem',
        last_name: 'Shaik',
        email: 'ashaik3@kent.edu'
    }
]
*/
