# Convert Model Edge Function

This Edge Function handles the upload and conversion of Keras models to TensorFlow.js format.

## Features
- Accepts .keras model files via FormData
- Stores original model in Supabase Storage
- Creates and updates database entries to track conversion status
- Simulates model conversion (to be implemented with actual conversion logic)

## Environment Variables Used
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY