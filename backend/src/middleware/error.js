export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  statusCode = err.statusCode || statusCode;
  
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'SERVER_ERROR';

  if (err.name === 'AIProviderError') {
    code = err.type;
    switch (err.type) {
      case 'AUTHENTICATION':
        statusCode = 401;
        break;
      case 'QUOTA':
      case 'RATE_LIMIT':
        statusCode = 429;
        break;
      case 'PROVIDER_UNAVAILABLE':
        statusCode = 503;
        break;
      case 'INVALID_RESPONSE':
        statusCode = 502;
        break;
      default:
        statusCode = 500;
        break;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    code
  });
};
