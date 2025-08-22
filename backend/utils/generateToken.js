import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		httpOnly: true, // Prevents XSS attacks
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		sameSite: "strict", // Prevents CSRF attacks
		secure: process.env.NODE_ENV !== "development",
	});
};

export default generateTokenAndSetCookie;
