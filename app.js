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
    const url="https://us21.api.mailchimp.com/3.0/lists/002e5d9027";
    const Options ={
        method: "POST",
        auth: "akashverma_04:0b967a3d5f04f299bb3860d083888a5-us21"
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

// {
//     "name": "$event_name",
//     "contact": $footer_contact_info,
//     "permission_reminder": "permission_reminder",
//     "email_type_option": true,
//     "campaign_defaults": $campaign_defaults
//   }
app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on 3000 port")
})


// api key d0b967a3d5f04f299bb3860d083888a5-us21
// list id 002e5d9027