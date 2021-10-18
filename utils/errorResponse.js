class ErrorResponse extends Error {
  constructor(name, statusCode, errorMsgArr) {
    console.log(Array.isArray(errorMsgArr));
    super(name);
    this.errors = errorMsgArr.map((errorMsg) => ({ msg: errorMsg }));
    this.statusCode = statusCode;
  }
}
module.exports = ErrorResponse;
