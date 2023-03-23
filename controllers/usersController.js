import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";
// @desc    Get all Users
// @route   GET /api/v1/users
// @access  Public
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc    Create a User
// @route   POST /api/v1/users
// @access  Private
export const createUser = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: `User ${user.email} was created`,
  });
});

// @desc    Get a single user
// @route   GET /api/v1/users/:id
// @access  Public
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new Error(`User that end with '${req.params.id.slice(-6)}' not found`)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Get users by
// @route   GET /api/v1/users/getUserBy
// @access  Public
export const getUserBy = asyncHandler(async (req, res, next) => {
  const query = req.query;
  if (!query.hasOwnProperty("email")) {
    return next(new ErrorResponse("Params can only be Email/userID"), 401);
  }
  const user = await User.find(query);
  if (!user) {
    return next(new ErrorResponse(`User with this params was not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    update a user cash
// @route   GET /api/v1/users/updateCash/:id
export const updateBalance = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const { credit = 0, cash = 0 } = req.body;
  console.log(userId);
  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { $inc: { cash: cash, credit: credit } },
    { new: true }
  );
  console.log(user);
  if (!user) {
    return next(
      new ErrorResponse(`User that ends with '${userId}' was not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: `Balance was Changed`,
  });
});

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const userEmail = user.email;
  if (!user) {
    return next(
      new ErrorResponse(
        `User that ends with '${req.params.id.slice(-6)}' was not found`,
        404
      )
    );
  }

  user.deleteOne();

  res.status(200).json({
    success: true,
    data: `User ${userEmail} was deleted`,
  });
});
