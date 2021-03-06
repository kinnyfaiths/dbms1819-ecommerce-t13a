var express = require('express');
var path = require('path');
var {Client} = require('pg'); 
var nodemailer = require('nodemailer');   
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const hbs = require('nodemailer-express-handlebars');

// instantiate client using your DB configurations

var client = new Client({
  database: 'd81j256p42t9pv',
  user: 'fvcvkoclyridsp',
  password: '6f1d387b5eb6208ce7b25139bfead2618fe1007c5ebd9dc779ce0217a00e10a6',
  host: 'ec2-54-227-241-179.compute-1.amazonaws.com',
  port: 5432,
  ssl: true 
}); 


// var http = require("http");
// setInterval(function() {
//     http.get("http://dbms1819-ecommerce-t13.herokuapp.com/list");
// }, 300000); // every 5 minutes (300000)

// connect to database
client.connect()
  .then(function() {
    console.log('connected to database!')
  })
  .catch(function(err) {
    console.log('cannot connect to database!')
  }); 

var app = express();
/*const app = express();*/
// tell express which folder is a static/public folder
//app.use(express.static(path.join(__dirname, 'views')));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars'); 


app.use(bodyParser.urlencoded({extended: false}));
app.get('/', function(req, res) {
  res.render('home1', {
    content:'Joanne C. Patoc',
    published: false
  });
});

// app.get('/about', function(req, res) {
//   res.render('about');
// });

// app.get('/order', function(req,res) {
//   res.render('order');
// });

// app.get('/contact', function(req,res) {
//   res.render('faq');
// });



app.get('/list', function(req, res) {

  client.query('SELECT * FROM Products')
   .then((results)=>{
    res.render('list', results);
  })
  .catch((err)=>{
    console.log('error',err);
    res.send('Error!');

  });
});

app.get('/', function(req,res) {
  res.render('list');
});


// START
// POST route from contact form
 app.post('/contact', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'dbms.team13@gmail.com',
      pass: 'Password1.'
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: 'dbms.team13@gmail.com',
    subject: 'New message from contact form at teamseventeen',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      res.render('contact-failure');
    }
    else {
      res.render('contact-success');
    }
  });
});

app.get('/products/update', function(req, res) {
  client.query('SELECT * FROM albums where id="id"')
  .then((results)=>{
    res.render('update', results); 
      
    })
    .catch((err)=>{
      console.log('error', err);
      res.send('Error!');
    });
});


app.post('/products/create', function(req, res) {
  console.log('req.body', req.body);
  client.query("Insert into albums (id, aname, adescription,  aprice, atype, abrand , aphoto) VALUES ('"+req.body.id+"','"+req.body.name+"','"+req.body.description+"','"+req.body.price+"','"+req.body.type+"','"+req.body.brand+"','"+req.body.photo+"')",
    (req, data)=> {
  console.log(req, data)
    res.redirect('/products')
  });
});
 
app.get('/products/create', function(req, res) {  
  client.query('SELECT * FROM brands',(req, data)=>{
    var brands = [];
    for (var i = 1; i < data.rows.length+1; i++){
      brands.push(data.rows[i-1]);
    }
  client.query('SELECT * FROM products_category',(req, data)=>{
    var products_category = [];
    for (var i = 1; i < data.rows.length+1; i++){
      products_category.push(data.rows[i-1]);
    }
    res.render('create-products',{
      brands: brands,
      category: products_category
      });
    });
  });
});

app.post('/products/update', function(req, res) {
  console.log('req.body', req.body);
  client.query("Insert into albums (aname, adescription,  aprice, atype, abrand , aphoto) VALUES ('"+req.body.name+"','"+req.body.description+"','"+req.body.price+"','"+req.body.type+"','"+req.body.brand+"','"+req.body.photo+"')",
    (req, data)=> {
  console.log(req, data)
    res.redirect('/products')
  });
});
 
app.get('/products/update', function(req, res) {  
  client.query('SELECT * FROM brands',(req, data)=>{
    var brands = [];
    for (var i = 1; i < data.rows.length+1; i++){
      brands.push(data.rows[i-1]);
    }
  client.query('SELECT * FROM products_category',(req, data)=>{
    var products_category = [];
    for (var i = 1; i < data.rows.length+1; i++){
      products_category.push(data.rows[i-1]);
    }
    res.render('update',{
      brands: brands,
      category: products_category
      });
    });
  });
});
app.get('/category/create', function(req, res) {
  res.render('create-category');
});



app.get('/categories', function(req, res) {
  client.query('SELECT * FROM products_category')
  .then((results)=>{
    res.render('categories', results); 
      
    })
    .catch((err)=>{
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/category/create', function(req, res) {
  res.render('create-category');
}); 

app.post('/category/create', function(req, res) {
  console.log('req.body', req.body);
  client.query("Insert into products_category (pcname) VALUES ('"+req.body.name+"')",
    (req, data)=> {
  console.log(req, data)
    res.redirect('/categories')
  });
});



app.get('/brands', function(req, res) {
  client.query('SELECT * FROM brands')
  .then((results)=>{
    res.render('brands', results); 
      
    })
    .catch((err)=>{
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/brands/create', function(req, res) {
  res.render('brands');
});
 

// app.post('/brands/create', function(req, res) {
//   console.log('req.body', req.body);
//   client.query("Insert into brands (brandsname, brandsdescription) VALUES ('"+req.body.name+"','"+req.body.description+"')", 
//   (req, data)=> {
//   console.log(req, data)
//     res.redirect('/brands')
//   });
// });



/* app.get('/products', function(req, res) {

  client.query('SELECT * FROM albums')
  .then((results)=>{
    res.render('products', results); 
      
    })
    .catch((err)=>{
      console.log('error', err);
      res.send('Error!');
    });
});


// POST route from order form
app.post('/order', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'dbms.team13@gmail.com',
      pass: 'Password1.'
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: 'dbms.team13@gmail.com',
    subject: 'New order from T13!',
    text: `${req.body.name} (${req.body.email}) says: Order Details:
  Name: ${req.body.name}
  Phone: ${req.body.phone}
  Email: ${req.body.email}
  Orders: ${req.body.message}`
  };
   smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      res.render('contact-failure');
    }
    else {
      res.render('contact-success');
    }
  });
}); */

app.listen(process.env.PORT||8000);
console.log('Server started on port 8000')