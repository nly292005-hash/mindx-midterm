import bcrypt from "bcrypt";
import crypto from "crypto";
import UserModel from "../models/user.model.js";

const usersController = {
 =
  register: async (req, res) => {
    try {
      const { userName, email, password } = req.body;

      if (!userName) {
        return res.status(400).send({
          success: false,
          message: "userName là bắt buộc"
        });
      }

      if (!email) {
        return res.status(400).send({
          success: false,
          message: "email là bắt buộc"
        });
      }

      if (!password) {
        return res.status(400).send({
          success: false,
          message: "password là bắt buộc"
        });
      }

      const existedUser = await UserModel.findOne({ email });

      if (existedUser) {
        return res.status(409).send({
          success: false,
          message: "Email đã tồn tại"
        });
      }

      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(password, saltRounds);

      const newUser = await UserModel.create({
        userName,
        email,
        password: hashedPassword
      });

      return res.status(201).send({
        success: true,
        message: "Đăng ký thành công",
        data: {
          _id: newUser._id,
          userName: newUser.userName,
          email: newUser.email
        }
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message
      });
    }
  },

 
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).send({
          success: false,
          message: "email là bắt buộc"
        });
      }

      if (!password) {
        return res.status(400).send({
          success: false,
          message: "password là bắt buộc"
        });
      }

      const currentUser = await UserModel.findOne({ email });

      if (!currentUser) {
        return res.status(401).send({
          success: false,
          message: "Sai email hoặc mật khẩu"
        });
      }

      const isCorrectPassword = bcrypt.compareSync(
        password,
        currentUser.password
      );

      if (!isCorrectPassword) {
        return res.status(401).send({
          success: false,
          message: "Sai email hoặc mật khẩu"
        });
      }

      const randomString = crypto.randomUUID();

      const apiKey =
        `mern-$${currentUser._id}$-$${currentUser.email}$-$${randomString}$`;

      currentUser.apiKey = apiKey;

      await currentUser.save();

      return res.status(200).send({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          _id: currentUser._id,
          userName: currentUser.userName,
          email: currentUser.email,
          apiKey
        }
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message
      });
    }
  }
};

export default usersController;