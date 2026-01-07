import userService from "../application/services/userService.js";
import response from "../utils/response.js";

export default class userController {
  constructor() {
    this.services = new userService();
  }

  authMe() {
    return async (req, res, next) => {
      try {
        const idUser = req.user?.id || 1299;
        const results = await this.services.authMe(idUser);
        response(200, "success", results, res);
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }

  permitMe() {
    return async (req, res, next) => {
      try {
        const accessPermission = req.body.permission;
        const idUser = req.user?.id || 1299;
        const results = await this.services.permitMe(idUser, accessPermission);
        response(200, "success", results, res);
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }
}
