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

// @desc    update a user balance
// @route   GET /api/v1/users/updateBalance/:id
export const updateBalance = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const { credit = 0, cash = 0 } = req.body;

  const { credit: prevCredit, cash: prevCash } = await User.findById(userId);
  if (!prevCredit || !prevCash) {
    new ErrorResponse(`User that ends with '${userId}' was not found`, 404);
  }

  // runValidators will not work with $inc
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { credit: credit + prevCredit, cash: cash + prevCash },
    { new: true, runValidators: true }
  );
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
