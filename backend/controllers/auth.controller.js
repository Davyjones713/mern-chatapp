import bcrypt from "bcryptjs/dist/bcrypt.js";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, verifyPassword, gender } = req.body;

    if (password !== verifyPassword) {
      return res.status(400).json({
        error: "Passwords dont match",
      });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      verifyPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        gender: newUser.gender,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Wrong username or password" });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(201).json({
      fullName: user.fullName,
      username: user.username,
      gender: user.gender,
      profilePic: user.profilePic,
      id: user._id,
    });
  } catch (error) {
    console.log("Error in login controller", error.message, error.stack);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res
      .status(200)
      .json({ status: "success", message: "User logged-out successfully" });
  } catch (error) {
    console.log("Error in login controller", error.message, error.stack);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
