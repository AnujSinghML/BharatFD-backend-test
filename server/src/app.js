import express from 'express';
import { connectDB } from '../src/db.js'; // Correct path to db.js
import faqRoutes from '../routes/faqRoutes.js'; // Correct path to faqRoutes.js
import { config } from 'dotenv';

config(); // Load environment variables
const app = express();

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/faqs', faqRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
