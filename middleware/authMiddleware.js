import queryHelper from "../utils/queryHelper.js";
import connection_mysyamrabu from "../frameworks/database/postgress/connection_mysyamrabu.js";
import JWTService from "../frameworks/services/JWTService.js";

const jwtService = new JWTService();

const db = new queryHelper(connection_mysyamrabu.sequelize);

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies[`Backend-Syamrabu-token_auth`];
    
    try {
      let decoded = await jwtService.verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        let decoded = await jwtService.verifyAccessToken(token);
        let id_user = decoded.id;

        let cekRefresh = await db.select({
          query:
            "select * from users where id = :id_user and token is not null",
          replacements: { id_user },
        });

        if (cekRefresh.length > 0) {
          let token = cekRefresh[0].token;

          try {
            let refreshDecoded = await jwtService.verifyRefreshToken(token);
            const accessToken = await jwtService.createAccessToken(
              refreshDecoded,
              "5m"
            );

            res.cookie(APP_NAME + "-token_auth", accessToken, {
              httpOnly: true,
              sameSite: "None",
              secure: true,
              domain: ".syamrabu.com",
              path: "/",
            });
            req.user = refreshDecoded;
            return next();
          } catch (err) {
            const decoded = await jwtService.decode(token);
            await jwtService.deleteToken(decoded.id);

            res.clearCookie(APP_NAME + "-token_auth", {
              httpOnly: true,
              sameSite: "None",
              secure: true,
              domain: ".syamrabu.com",
              path: "/",
            });

            return res.status(401).json({
              status: false,
              code: 401,
              message: "Unauthorized: Token expired",
            });
          }
        }
        return res.status(401).json({
          status: false,
          code: 401,
          message: "Unauthorized: Token expired",
        });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          status: false,
          code: 401,
          message: "Unauthorized: Token tidak valid",
        });
      } else {
        return res.status(401).json({
          status: false,
          code: 401,
          message: "Unauthorized: Token error",
          detail: err.message,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: false,
      code: 401,
      message: "Unauthorized: Token error",
    });
  }
};

export default authMiddleware;
