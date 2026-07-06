// Custom error class that extends the native Error with an HTTP status code.
// This allows throwing errors with a specific status code that the error handler can use.
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Central error-handling middleware for Express.
const errorHandler = (err, req, res, next) => {
    // Default to 500 if no status code is set on the error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    // Handle JSON parsing errors from express.json() body parser
    if (err.type === 'entity.parse.failed') {
        statusCode = 400;
        message = 'Invalid JSON in request body';
    }

    // Log the error with a timestamp for debugging
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${statusCode} - ${message}`);

    // Log full stack trace for unexpected server errors
    if (statusCode === 500) {
        console.error(err.stack);
    }

    // Send a consistent JSON error response matching the project's existing pattern
    res.status(statusCode).json({ error: message });
};

export default errorHandler;
