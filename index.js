const express=require("express");
const app=express();
const filesystem=require("fs");


app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");  //sending the html file     
});

app.get("/video",function(req,res){
    const range=req.headers.range;
    if(!range)
        res.status(400).send("It requires the range header");
    const vpath="video.mp4";
    const size=filesystem.statSync("video.mp4").size;

    const blockSize=10**6;
    const start=Number(range.replace(/\D/g,""));
    const end=Math.min(start+blockSize,size-1);
    const videoLength=end-start+1;
    const headers={
        "Content-Range":`bytes ${start}-${end}/${size}`,
        "Accept-Ranges":"bytes",
        "Content-Length":videoLength,
        "Content-Type":"video/mp4"
    };

    res.writeHead(206,headers);  //status 206 tells the browser that only partial content is sent
    const videoStream=filesystem.createReadStream(vpath,{start,end});
    videoStream.pipe(res);
});

var port=8000
app.listen(port,function(){
    console.log("Listening on port",port);
});