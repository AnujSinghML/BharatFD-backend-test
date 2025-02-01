#!/bin/bash

# Create FAQ
curl -X POST -H "Content-Type: application/json" -d '{
  "question": "How to reset password?",
  "answer": "<p>Visit account settings page</p>"
}' http://localhost:5000/api/faqs

# Get English FAQs
curl http://localhost:5000/api/faqs

# Get Hindi FAQs (may take 2-3 seconds for background translation)
curl http://localhost:5000/api/faqs?lang=hi