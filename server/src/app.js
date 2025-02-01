require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const faqRoutes = require('../routes/faq'); // Ensure this path is correct

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/faqs', faqRoutes); // Ensure this matches the route in faq.js

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
