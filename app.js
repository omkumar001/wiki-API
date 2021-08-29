//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");


app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true , useUnifiedTopology: true });


const articleSchema={
    title:String,
    content:String,
}

const Article=mongoose.model("Article",articleSchema);



////////////////////////////////////////////////////////// REQUEST TARGETTING ALL THE ARTICLES ///////////////////////////////

app.route("/articles")

.get(function(req,res){
   
    Article.find({},function(err,foundArticle){

        if(!err){
            res.send(foundArticle);
            //console.log(foundArticle);
        }
        else{
            res.send(err);   
         }
     });
})
     .post( function(req,res){

        const newArticle=new Article({
            title:req.body.title,
            content:req.body.content,
    
        });
    
        newArticle.save(function(err){
              
            if(!err)
            res.send("Articles successfully Posted :)"); 
            else{
                res.send(err);
            }
        });
    console.log(req.body.title);
    console.log(req.body.content);

   })
       .delete( function(req,res){

         Article.deleteMany({},function(err){
         if(!err)
         res.send("Articles are being successfully deleted !!!");
         else
         res.send(err);
        });
    });


////////////////////////////////////////////////////////// REQUEST TARGETTING THE SPECIFIC ARTICLES ///////////////////////////////


app.route("/articles/:articleTitle")
.get(function(req,res){

    const specArticle=req.params.articleTitle;

    Article.findOne({title:specArticle},function(err,foundArticle){
       
        if(!foundArticle)
        res.send("Data is not found !!");
        else{
          res.send(foundArticle);
          }
      });
   })
   .put(function(req,res){
    
    //{overwrite:true}
    Article.updateOne( {title:req.params.articleTitle},{title:req.body.title,content:req.body.content},function(err){

        if(err)
        res.send(err);
        else
        res.send("Successfully updated the article");
        
        });
   }) 
   .patch(function(req,res){

    Article.updateOne({title:req.params.articleTitle},{$set:req.body},function(err){
        
        if(!err){
            res.send("Successfully Updated");
        }
        else
        res.send(err);
    });

   })
   .delete(function(req,res){

    Article.deleteOne({title:req.params.articleTitle},function(err){
          if(!err)
        res.send("Successfully Deleted !!");
        else
        res.send(err);
    });

   });

  









app.listen(3000, function () {
  console.log("Server started on port 3000");
});
