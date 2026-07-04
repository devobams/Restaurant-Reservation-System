
import express from "express";

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
// app.use("/api/reservations", reservationRoutes);

// Handle Unknown Routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

export default app;