// Import required modules
const express = require('express');
const cors = require('cors');
// Create an instance of Express
const app = express();
app.use(cors());
// Define a route



  
// Mock data for demonstration
const cartData = {
    'cart1': {
      freight: 5.99,
      discount: 10
    },
    'cart2': {
      freight: 7.99,
      discount: 15
    }
  };
  
  // Define an endpoint that takes cartid as a parameter
  app.get('/cart/:cartid', (req, res) => {
    const cartid = req.params.cartid;
  console.log('hit');
    // Check if the cartid exists in the mock data
    if (cartData.hasOwnProperty(cartid)) {
      const { freight, discount } = cartData[cartid];
      res.json({ freight, discount }); // Respond with freight and discount values
    } else {
      res.status(404).json({ error: 'Cart not found' }); // Respond with a 404 error if cartid doesn't exist
    }
  });

// Define port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
