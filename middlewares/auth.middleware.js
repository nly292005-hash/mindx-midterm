import UserModel from "../models/user.model.js";

const authentication = async (req, res, next) => {
  try {
    const { apiKey } = req.query;

    // Không gửi apiKey
    if (!apiKey) {
      return res.status(401).send({
        success: false,
        message: "Thiếu apiKey"
      });
    }

    // Tìm user có apiKey tương ứng
    const currentUser = await UserModel.findOne({ apiKey });

    if (!currentUser) {
      return res.status(401).send({
        success: false,
        message: "apiKey không hợp lệ"
      });
    }

    // Lưu user vào request
    req.user = currentUser;

    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};

export default authentication;