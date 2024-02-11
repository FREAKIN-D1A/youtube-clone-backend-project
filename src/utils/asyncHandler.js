import { COLORS } from "../constant.js";
// instead of writing async await each and everytime,
// we use a separate async handler function

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

export { asyncHandler };

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     console.log(COLORS.FgRed, "\n\n");
//     console.log("async handler error Error:\n", error);
//     console.log(COLORS.Reset, "\n\n");

//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
