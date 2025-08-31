import User from "../models/user.js";

// Function to create user
const create_user = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check for duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(409)
        .json({ message: "Email already exists, Please login!" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      images: req.body.images,
    });

    await newUser.save();

    res.status(201).json({
      message: "User Created Successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Function to fetch all users
const get_users = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

const get_user_by_id = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await User.findById(id);
    res.status(201).json(response);
  } catch (error) {}
};

// Function to update user
const update_user = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Find the existing menu item
    const user = await User.findByIdAndUpdate(req.params.id);

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;

    // Handle image updates if new images are uploaded
    if (req.body.images && req.body.images.length > 0) {
      user.images = req.body.images;
    }

    // Save the updated menu to the database
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error in updating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Function to delete user
const delete_user = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    res.status(201).json({ message: "User deleted", user });
  } catch (error) {
    res.status(500).json({ message: "Error While deleting User" }, error);
  }
};

export { create_user, get_users, update_user, get_user_by_id, delete_user };
