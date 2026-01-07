const statusMessages = {
  200: "ok",
  201: "created",
  202: "accepted",
  203: "setting not found",
  204: "data not found",
  304: "save failed",
  305: "delete failed",
  400: "bad request",
  401: "authentication required",
  403: "authentication failed",
  404: "endpoint not Exist",
  405: "private fn call require (db and con) as params",
  406: "not acceptable",
  409: "data already exist",
  451: "unavailable module",
  500: "query error",
  501: "query error by rules",
  503: "database not available",
  505: "https required",
};

export default function response(code, message, datas, res) {
  function omitEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== "" && v !== null && v !== undefined
      )
    );
  }
  if (code < 205) {
    const responseObj = {
      code,
      status: statusMessages[code] || "unknown status code",
      messages: message || "success",
      ...datas,
    };
    res.status(code).json(omitEmpty(responseObj));
  } else {
    res.status(code).json({
      code,
      status: statusMessages[code] || "unknown status code",
      messages: message || statusMessages[code] || "failed",
    });
  }
}
