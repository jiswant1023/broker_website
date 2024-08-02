const User = require("../models/user.model.js");
const encrypt = require("bcrypt");
const { errorHandler } = require("../utils/error.js");
const jsonwebtoken = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const encryptPassword = encrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: encryptPassword });

  try {
    await newUser.save();
    res.status(201).json({
      message: "user created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    const validPassword = await encrypt.compareSync(
      password,
      validUser.password
    );

    if (!validPassword) return next(errorHandler(401, "Invalid Credentials"));

    const token = jsonwebtoken.sign(
      { id: validUser._id },
      process.env.JWT_SECRET
    );
    // to hide password from user
    const { password: pass, ...rest } = validUser._doc;

    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      success: true,
      message: "login successfull",
      rest,
    });
  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET);

      const { password: pass, ...rest } = user._doc;

      res.cookie("access_token", token, { httpOnly: true }).status(200).json({
        success: true,
        message: "login successfull",
        rest,
      });
    } else {
      const generatePassword =
        Math.random().toString(30).slice(-8) +
        Math.random().toString(30).slice(-8);

        const hassedPassword = encrypt.hashSync(generatePassword, 10); 
        const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(30).slice(-4), email: req.body.email, password: hassedPassword , avatar: req.body.photo}); 
        
        await newUser.save();

        const token = jsonwebtoken.sign({ id: newUser._id }, process.env.JWT_SECRET);

        const { password: pass, ...rest } = newUser._doc;
  
        res.cookie("access_token", token, { httpOnly: true }).status(200).json({
          success: true,
          message: "login successfull",
          rest,
        }); 
    }
  } catch (error) {
    next(error);
  }
};

const signout= async(req, res, next) => {
try {
  res.clearCookie('access_token');
  res.status(200).json({
    message:"User has been signed Out",
});
} catch (error) {
  next(error);
}
}
module.exports = {
  signup,
  signin,
  google,
  signout
};
