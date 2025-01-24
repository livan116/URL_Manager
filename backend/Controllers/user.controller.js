const User = require("../Models/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Register a new user

exports.registerUser = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //check if user exits
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user

    user = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
    });
    await user.save();

    //create and return jwt

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({ token, message: "User Register Succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// login controller

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    //Generate a JWT token with user id and email
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );
    res
      .status(200)
      .json({ success: true, token, message: "User Logged in Successfully" });
  } catch (error) {
    console.log("Error Logging in:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, mobile } = req.body;
  const userId = req.user.id; //extracted from token via middleware
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    //update name if provided
    if (name && name !== user.name) {
      user.name = name;
    }

    //update email if provided

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
      user.email = email;
    }

    //if number is provided

    if (mobile && mobile !== user.mobile) {
      const existingMobile = User.findOne({ mobile });
      if (existingMobile) {
        res
          .status(400)
          .json({ success: false, message: "Mobile already in use" });
      }
      user.mobile = mobile;
    }

    await user.save();
    res.status(200).json({success:true,message:"User updated successfully"})
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteUser = async (req,res) =>{
    const userId = req.user.id;
    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        return res.status(200).json({success:true,message:"User deleted successfully"})
    }
    catch(error){
        return res.status(500).json({success:false,message:"Sever Error"})
    }
}
