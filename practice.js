
//maitain the error of main 
app.use("/",(err,req,res,next)=>{
  if(err){
    res.status(510).send("something went wrong")
  }
})