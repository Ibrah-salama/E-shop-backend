exports.errHandler = (err, req, res, next)=> {
  if (err.name === "UnauthorizedError") {
    return res.status(500).json({
      status: "Server Failure",
      serverMessage: err.message,
      message: "The user is not authorized!",
    });
  }
  if (err.name === "ValidationError") {
    return res.status(500).json({
      status: "Server Failure",
      serverMessage: err.message,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "Failure",
    message: err
  })
}


