const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const { application, json } = require("express");
const https=require("https");

const app=express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));


app.get("/" ,function(req,res){
    res.sendFile(__dirname+"/signup.html")
});

app.post("/" ,function(req,res){
    const firstN=req.body.firstName;
    const lastN=req.body.lastName;
    const email=req.body.email;
    const data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstN,
                    LNAME: lastN,
                }
            }
        ]
    };
    const jsonData=JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/List_id";
    const Options ={
        method: "POST",
        auth: "USER_NAME:API_KEY"
    }
    const request=https.request(url,Options,function(response){
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on 3000 port")
})
