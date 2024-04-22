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
  app.get('/discount/:cartid', (req, res) => {
    const cartid = req.params.cartid;
    const myHeaders = new Headers();
    myHeaders.append("X-Auth-Token", "44v4r4o38ki0gznr4kn5exdznzft69c");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");
    const raw = JSON.stringify({
      "cart": {
        "discounts": [
          {
            "discounted_amount": 2,
            "name": "manual"
          }
        ]
      }
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    fetch(`https://api.bigcommerce.com/stores/eagnf01idv/v3/checkouts/${cartid}/discounts`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        res.json({ result });
      })
      .catch((error) =>{
        console.error(error);
        res.send('error',error);
      });
  });
// Define port
const PORT = process.env.PORT || 3000;
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






