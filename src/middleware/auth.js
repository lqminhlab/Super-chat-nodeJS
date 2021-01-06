const User = require('../model/user');

const AppUtils = require('../util/app_utils');

exports.verified = async (req, res, next) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.x_authorization;
	if (!accessTokenFromHeader) {
        console.log("Header");
		return res.json(AppUtils.reponseError('Xác thực không thành công!'));
	}

	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	const verified = await AppUtils.verifyToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!verified) {
		return res.json(AppUtils.reponseError('Xác thực không thành công!'));
    }
    
    console.log("verified: ", verified);

	const user = await User.findOne({email: verified.payload.email});
	req.user = user;

	return next();
};