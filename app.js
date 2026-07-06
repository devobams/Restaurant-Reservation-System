import reservationRoutes from "./src/routes/reservation.routes.js";
import express from "express";
import errorHandler from "./src/middleware/error.middleware.js";

const app = express();

// Middleware
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Restaurant Reservation API is running"
    });
});

// Register Routes Here
app.use("/api/reservations", reservationRoutes);

// Handle Unknown Routes
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.statusCode = 404;
    next(error);
});

// Error handling middleware
app.use(errorHandler);

export default app;