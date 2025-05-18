const User = require("./../Model/userModel");
const asyncErrorHandler = require("./../util/AsyncErrorHandler");

exports.signUp = asyncErrorHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});
