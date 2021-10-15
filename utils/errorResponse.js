class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.msg = message;
    this.statusCode = statusCode;
  }
}
module.exports = ErrorResponse;
