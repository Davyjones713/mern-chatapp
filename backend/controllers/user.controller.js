import User from "../models/user.model.js";

const getUsersForSidebar = async (req, res) => {
  try {
    const userSignedInId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: userSignedInId },
    }).select("-password");

    res.status(200).json({
      status: "success",
      data: filteredUsers,
    });
  } catch (error) {
    console.log("Error in User controller", error.message, error.stack);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

export default getUsersForSidebar;
