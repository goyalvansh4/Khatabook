const express = require('express');
const fs= require('fs');
const path= require('path');
const app = express();


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));


app.get('/',(req,res)=>{
 fs.readdir(`Khata`,(err,files)=>{
   if(err) return res.send("Error in file reading");
   res.render("home",{files:files})
 })
});
app.get("/view/:fileName",(req,res)=>{
  fs.readFile(`Khata/${req.params.fileName}`,'utf-8',(err,data)=>{
    if(err) return res.send("Error in reading File");
    res.render("read",{content:data});
  })
})

app.get('/edit/:fileName',(req,res)=>{
  fs.readFile(`Khata/${req.params.fileName}`,'utf-8',(err,data)=>{
    if(err) return res.send("Error in reading File");
    res.render("edit",{file:req.params.fileName,content:data});
  })
  
})
app.post("/update/:fileName",(req,res)=>{
   fs.writeFile(`Khata/${req.params.fileName}`,req.body.content,(err)=>{
    if(err) return res.status(500).send("Something went wrong");
    res.redirect("/");
   })
})
app.get("/add",(req,res)=>{
  res.render("add");
})

app.post("/create",(req,res)=>{
  let date = new Date();
  let fileName = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
   fs.readdir("Khata",(err,files)=>{
     let isExits = files.findIndex((file)=> file==`${fileName}.txt`);
     if(isExits !== -1){
      fs.readFile(`Khata/${fileName}.txt`, 'utf8', (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return;
        }
        const lines = data.split('\n').filter(line => line.trim() !== '');
        let fileData = `S.no-> ${lines.length+1} Grocery Item-> ${req.body.grocery} Price-> ${req.body.price},\n`
       fs.appendFile(`Khata/${fileName}.txt`,fileData,(err)=>{
        if(err) return res.send("Error in appending file");
        res.redirect("/")
       })
      });
      
     }
     else{
      let data = `S.no-> 1 Grocery Item-> ${req.body.grocery} Price-> ${req.body.price},\n`;
      fs.writeFile(`Khata/${fileName}.txt`,data,(err)=>{
        if(err) return res.status(500).send("Something went wrong");
        res.redirect("/");
       })
     }
  })
   
})

app.get('/delete/:fileName',(req,res)=>{
  console.log(req.params.fileName)
   fs.unlink(`Khata/${req.params.fileName}`,(err)=>{
    if(err) return res.send(err);
    res.redirect("/");
   })
})

const PORT = process.env.PORT || 3000
app.listen(PORT,0.0.0.0()=>{
  console.log(`Server is listenting on port ${PORT}`);
})
