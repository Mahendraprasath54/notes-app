const User = require('../models/user_model')
const jwt = require("jsonwebtoken");

const createUser = async (req,res) => {
    
    const {fullName, email, password} = req.body;
    if(!fullName)
    {
        return res
        .status(400)
        .json({error:true, message: "full name is required"});
    }

    if(!email)
    {
        return res.status(400).json({error: true, message:"email is required"});
    }
    if(!password)
    {
        return res.status(400).json({error: true, message:"password is required"});
    }
    const isUser = await User.findOne({email:email});
    if(isUser)
    {
       return res.json({
        error:true,
        message:"user already exist"
       }) ;

    }
    const newUser = new User({
        fullName,
        email,
        password

    })
    await newUser.save();
    const accesstoken = jwt.sign({ user: newUser }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"30m",
    });
    return res.json({
        error :false,
        newUser,
        accesstoken,
        message:"Registration Sucessfull",
    });
}

const login = async(req, res)=>{
    const {email, password } = req.body;
    if(!email)
    {
        return res.status(400).json({message: "email is required"});
    }
    if(!password)
    {
        return res.status(400).json({message: "password is required"});

    }

    const userInfo = await User.findOne({email:email});

    if(!userInfo)
    {
        return res.status.json({message:"user not found"});

    }

        if(userInfo.email == email && userInfo.password == password)
        {
            const user = { user: userInfo};
            const accessToken = jwt.sign({ user: userInfo }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn:"36000m"
            });
            return res.json({
                error:false,
                message:"Login Successful",
                email,
                accessToken
            })
        }
        else
        {
            return res.status(400).json({
                error:true,
                message:"Invalid Credentials"
            });
        }

}  

const getUser = async(req, res) =>{
    const user = req.user.user;
    const isUser = await  User.findOne({_id:user._id});

    if(!user)
    {
        return res.status(401);
    }
    return res.json({
       user:{
        fullName: isUser.fullName,
        email: isUser.email,
        _id: isUser._id,
        createdOn: isUser.createdOn
       }
    })
}
module.exports = {createUser, login, getUser};