const express=require("express")
const {userModel}=require("../model/users.model")
const {auth}=require("../middleware/auth.middleware")
const userRouter=express.Router()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")


userRouter.post("/register",async(req,res)=>{
    const {name,email,pass}=req.body
    try{
        bcrypt.hash(pass, 5, async(err, hash)=> {
            // Store hash in your password DB.
            if(err){
                res.status(400).json({error:err.message})
            }else{
                const user=new userModel({name,email,pass:hash})
                await user.save()
                res.status(200).json({msg:"new user added",updatedUser:req.body})
            }
        });
        
       
    }catch(err){
        res.status(400).json({err:err.message})
    }

})


userRouter.post("/login",async(req,res)=>{
const {email,pass,name}=req.body
    try{
        const user=await userModel.findOne({email})
        
        if(user){
            bcrypt.compare(pass, user.pass, (err, result)=> {
                // result == true
                if(result){
                    let token=jwt.sign({userID:user._id,user:user.name},'masai')
                    res.status(200).json({msg:"Login Successfull!!",token:token,name:name})
                }else{
                    res.status(200).json({msg:"Wrong Credential!!"})
                }
            });
           
        }else{
            res.status(200).json({msg:"Wrong Credential!!"})
        }
    }catch(err){
        res.status(400).json({error:err.message})
    }
})

userRouter.get("/",async(req,res)=>{
    try{
        const notes=await userModel.find()
        res.send(notes)
    }catch(err){
        res.json({error:err.message})
    }
})
userRouter.delete("/delete/:id",async(req,res)=>{
    
    const {id} = req.params
    try{
        const user=await userModel.findOne({_id:id})
        
        
            await userModel.findByIdAndDelete({_id:id},req.body)
            res.json({msg:`${user.name} has deleted`})
        
            res.json({msg:"Not authorized"})
        

    }catch(err){
        res.json({error:err})
    }
})

module.exports={
    userRouter
}