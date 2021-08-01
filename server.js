'use strict';

const express=require('express');
const cors=require('cors');
const axios=require('axios');
const app=express();
const mongoose=require('mongoose');
require('dotenv').config();
app.use(express.json());
app.use(cors());

const PORT=process.env.PORT || 8000;
mongoose.connect('mongodb://127.0.0.1:27017/testdatabase',
{
    useNewUrlParser:true, useUnifiedTopology:true
});

//---------------------- msh mohem------------
app.get('/',(req,res)=>{
    res.send('working');
});







// get API data
const apiData=async(req,res)=>{
    const url='https://coffeepedias.herokuapp.com/coffee-list';
    await axios.get(url).then(response=>{
        let allData=response.data.map(el=>{
            return new Coffee(el);
        });
        res.send(allData);
    });
}

app.get('/apidata',apiData);



const getFunction=async(req,res)=>{
    const email=req.query.email;
    userModel.findOne({email:email},(err,data)=>{
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    });
}

app.get('/userdata',getFunction);

const postFunction=async(req,res)=>{
    const email=req.query.email;
    const {id,title,descrption,img,ingredients}=req.body;
    userModel.findOne({email:email},(err,data)=>{
        if(err){
            res.send(err);
        }else{
            data.coffeeData.push({
                id:id,
                title:title,
                descrption:descrption,
                ingredients:ingredients,
                img:img
            });
            data.save();
            res.send(data.coffeeData);
        }
    });
}

app.post('/addtofav',postFunction);



// update

const updatefunction=async(req,res)=>{
    const email=req.query.email;
    const {id,title,descrption,img}=req.body;
    const favid=Number(req.params.ids);
    userModel.findOne({email:email},(err,data)=>{
        if(err){
            res.send(err);
        }else{
            data.coffeeData.splice(favid,1,{
                id:id,
                title:title,
                descrption:descrption,
                img:img
            });
            data.save();
            res.send(data.coffeeData);
        }
    });
}


app.put('/update/:ids',updatefunction);


// delete 
const deleteFunction=async(req,res)=>{
    const email=req.query.email;
    const favid=req.params.id;
    userModel.findOne({email:email},(err,data)=>{
        if(err){
            res.send(err);
        }else{
            let newArray=[];
            data.coffeeData.forEach((el,idx)=>{
                if(idx!==Number(favid)){
                    newArray.push(el);
                }
            });
            data.coffeeData=newArray;
            data.save();
            res.send(data.coffeeData);
           
        }
    });

}

app.delete('/delete/:id',deleteFunction)

class Coffee{
    constructor(data){
        this.id=data.id;
        this.title=data.title;
        this.img=data.image_url;
        this.descrption=data.description;
        this.ingredients=data.ingredients;
    }
}




const coffeeSchema=mongoose.Schema({
    title:String,
    descrption:String,
    ingredients:String,
    img:String,
    id:String
});

const userSchema=mongoose.Schema({
    email:String,
    coffeeData:[coffeeSchema]
})

const userModel=mongoose.model('favcoffee',userSchema);

const userSeed=()=>{
    const user=new userModel({
        email:'ibrahem.omari96@gmail.com',
        coffeeData:[{
            id:'121212112',
            title:"Latte",
            descrption:"coffee",
            ingredients:"coffee",
            img:"coffee",
        }]
    });

    user.save();
    console.log(user);
};


// userSeed();



app.listen(PORT,()=>{
    console.log('server to port =',PORT);
});