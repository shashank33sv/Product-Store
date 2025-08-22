import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import generateTokenAndSetCookie from "../utils/generateToken.js";

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		generateTokenAndSetCookie(user._id, res);
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
		});
	} else {
		res.status(401);
		throw new Error("Invalid email or password");
	}
});

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({ name, email, password });

	if (user) {
		generateTokenAndSetCookie(user._id, res);
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
	});
	res.status(200).json({ message: "Logged out successfully" });
};

export { loginUser, signupUser, logoutUser };
