//npm init inside the directory
// npm install express mongoose body-parser --save
//open file app.js
//run mongod in an other treminal

var express   = require ('express'),
methodOverride = require('method-override'),
expressSanitizer = require("express-sanitizer"),
app           =  express(),
bodyParser    = require ('body-parser'),
mongoose      = require('mongoose');


//APP CONFIG

mongoose.connect("mongodb://localhost:27017/RestfulBlog");

//install ejs

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//MONGOOSE/MODEL CONFIG

var bookSchema = new mongoose.Schema({
    title: String,
    Author: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
});

var Book = mongoose.model("Book", bookSchema);

 
//RESTFUL ROUTES

 app.get("/", function(req, res){
     res.redirect("/books");
 });
 
 //INDEX ROUTE
 
 app.get("/books", function(req, res){
     Book.find({}, function(err, books){
         if(err){
             console.log("ERROR!");
         } else {
             res.render("index", {books: books});
         }
     });
     
 });
 
 //NEW ROUTE
 
 app.get("/books/new", function(req, res){
       res.render("new");
 });
 
 //CREATE ROUTE
 
 app.post('/books', function(req, res){
     //create book
       console.log(req.body);
       console.log("==============");
       console.log(req.body);
     Book.create(req.body.book, function(err, newBook){
         if(err){
             res.render("new");
         } else {
            //redirect to the index
             res.redirect("/books");
         }
     });
 });
 
 //SHOW ROUTE
 app.get('/books/:id', function(req, res){
     Book.findById(req.params.id, function(err, foundBook){
         if(err){
             res.redirect("/books");
         } else {
             res.render("show", {book: foundBook});
         }
     });
 });
 
// EDIT ROUTE
 
 app.get("/books/:id/edit", function(req, res){
     Book.findById(req.params.id, function(err, foundBook){
         if(err){
             res.redirect("/books");
         } else {
             res.render("edit", {book: foundBook});
         }
     });
 });
 
 
 //UPDATE ROUTE
 
    //npm install method-override
 
 app.put("/books/:id", function(req, res){
     req.body.book.body = req.sanitize(req.body.book.body)
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updateBook){
        if(err){
            res.redirect("/books");
        } else {
            res.redirect("/books/" + req.params.id);
        }
    });
 });
 
 //DELETE ROUTE
 
 app.delete("/books/:id", function(req, res){
     //destroy book
     Book.findByIdAndRemove(req.params.id, req.body.book, function(err, removeBook){
         if(err){
             res.redirect("/books");
         }else {
             res.redirect("/books");
         }
     });
     //redirect somewhere
 });
   
//SANITIZE BOOK BODY
  //npm install express-sanitizer --save





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Restufl Routing in Running");
});
