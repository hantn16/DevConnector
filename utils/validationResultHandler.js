const ErrorResponse = require('./errorResponse');
const validationResultHandler = (result) => {
  const errorMsgArr = result.formatWith(
    ({ location, msg, param, value, nestedErrors }) => {
      // Build your resulting errors however you want! String, object, whatever - it works!
      // Example: body[email]: Please include a valid email
      return `${location}[${param}]: ${msg}`;
    }
  );
  return new ErrorResponse('Validation Error', 400, errorMsgArr.array());
};
module.exports = validationResultHandler;
