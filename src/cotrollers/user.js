const user = require('../models/user');

const bcrypt = require('bcryptjs');


const GetAllUser = async(req, res) => {

    let existingusers;
    try {
        existingusers = await user.find();
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while fetching user", data: error});
    }
    
    return res.status(200).json({success: true, message: `All Users`, data: existingusers});
}

const FindUserById = async(req, res) => {

    const {id} = req.params;

    let existinguser;
    try {
        existinguser = await user.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while fetching user", data: error});
    }

    if (!existinguser) {
        return res.status(400).json({success: false, message: "User doesn't exist!! ", datat: null});
    }  
    
    return res.status(200).json({success: true, message: `User was found`, data: existinguser});
}

const DeleteUser = async(req, res) => {

    const {id} = req.params;

    let existinguser;
    try {
        existinguser = await user.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while fetching user", data: error});
    }

    if (!existinguser) {
        return res.status(400).json({success: false, message: "User doesn't exist!! ", datat: null});
    }  

    try {
        await existinguser.deleteOne();
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while saving user", data: error});
    }
    
    return res.status(200).json({success: true, message: `User was Deleted successfully`, data: null});
}

const Register = async(req, res) => {

    const {email, name, password, phone} = req.body;

    let existinguser;
    try {
        existinguser = await user.findOne({ email: email});
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while fetching user", data: error});
    }

    if (existinguser) {
        return res.status(400).json({success: false, message: "Email already exist!! ", datat: null});
    } 

    const hashedpassword = await bcrypt.hash(password, 10);

    const NewUser = new user({
        email,
        name,
        phone,
        password: hashedpassword
    });

    try {
        await NewUser.save();
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while saving user", data: error});
    }

    return res.status(200).json({success: true, message: `user added successfly`, data: NewUser});
}

const Login = async(req, res) => {

    const {email, password} = req.body;

    let existinguser;
    try {
        existinguser = await user.findOne({ email: email});
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while fetching user", data: error});
    }

    if (!existinguser) {
        return res.status(400).json({success: false, message: "Email doesn't exist!! ", datat: null});
    }  

    let check = await bcrypt.compare(password, existinguser.password);

    if (!check) {
        return res.status(400).json({success: false, message: "Check your password ", datat: null});
    }  

    return res.status(200).json({success: true, message: `Welcome ${existinguser.name}`, data: existinguser});

}

const UpdateUser = async(req, res) => {

    const {email, name, password, phone} = req.body;
    const {id} = req.params;

    let existinguser;
    try {
        existinguser = await user.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while fetching user", data: error});
    }

    if (!existinguser) {
        return res.status(400).json({success: false, message: "user doesn't exist!! ", datat: null});
    }  

    existinguser.email = email
    existinguser.phone = phone
    existinguser.name = name
    existinguser.password = await bcrypt.hash(password, 10);

    try {
        await existinguser.save();
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while saving user", data: error});
    }

    return res.status(200).json({success: true, message: `user Updated successfly`, data: existinguser});

}

exports.GetAllUser = GetAllUser
exports.FindUserById = FindUserById
exports.DeleteUser = DeleteUser
exports.Login = Login
exports.Register = Register
exports.UpdateUser = UpdateUser