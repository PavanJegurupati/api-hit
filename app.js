// Import required modules
const express = require("express");
const cors = require("cors");
// Create an instance of Express
const app = express();
app.use(cors());
// Define a route

app.use(express.json()); // Add this line to parse JSON data in the request body

// Mock data for demonstration
const cartData = {
  cart1: {
    freight: 5.99,
    discount: 10,
  },
  cart2: {
    freight: 7.99,
    discount: 15,
  },
};

// Define an endpoint that takes cartid as a parameter
app.get("/cart/:cartid", (req, res) => {
  const cartid = req.params.cartid;
  console.log("hit");
  // Check if the cartid exists in the mock data
  if (cartData.hasOwnProperty(cartid)) {
    const { freight, discount } = cartData[cartid];
    res.json({ freight, discount }); // Respond with freight and discount values
  } else {
    res.status(404).json({ error: "Cart not found" }); // Respond with a 404 error if cartid doesn't exist
  }
});

app.post("/discount/:cartid", (req, res) => {
  const cartid = req.params.cartid;
  const myHeaders = new Headers();
  myHeaders.append("X-Auth-Token", "44v4r4o38ki0gznr4kn5exdznzft69c");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  const formData = JSON.stringify(req.body.formData);
  console.log(formData, "this is formData");

  const raw = JSON.stringify({
    cart: {
      discounts: [
        {
          discounted_amount: 2,
          name: "manual",
        },
      ],
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    `https://api.bigcommerce.com/stores/eagnf01idv/v3/checkouts/${cartid}/discounts`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log("RESULT FROM discount: ", result);
    })
    .catch((error) => {
      console.error("error while adding disocunt:", error);
    });

  async function addMetafield() {
    try {
      const url = `https://api.bigcommerce.com/stores/eagnf01idv/v3/carts/${cartid}/metafields`;

      const bodyData = {
        permission_set: "write_and_sf_access",
        namespace: "Sales Department",
        key: "formData",
        value: formData,
        description: "Name of staff member",
      };

      const requestOptions2 = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Auth-Token": "oe5uijwhafstu69o0vj50kr7q5jv5c7", // Replace "your_auth_token" with your actual BigCommerce API token
        },
        body: JSON.stringify(bodyData),
      };

      const response = await fetch(url, requestOptions2);
      const result = await response.json();
      console.log("esult form metafield api:", result);
    } catch (error) {
      console.error("Error adding metafield:", error);
    }
  }

  addMetafield();

  res.json({ success: true });
});

app.get("/addmetafields/:orderid", async (req, res) => {
  const orderid = req.params.orderid;
  const myHeaders = new Headers();
  myHeaders.append("X-Auth-Token", "oe5uijwhafstu69o0vj50kr7q5jv5c7");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");

  console.log(orderid, "oid");
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response1 = await fetch(
      `https://api.bigcommerce.com/stores/eagnf01idv/v2/orders/${orderid}`,
      requestOptions
    );
    if (!response1.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response1.json();
    console.log(result);
    const cartId = result.cart_id;
    console.log("this is cartId from order:", cartId);

    const myHeaders2 = new Headers();
    myHeaders2.append("X-Auth-Token", "oe5uijwhafstu69o0vj50kr7q5jv5c7");
    myHeaders2.append("Content-Type", "application/json");
    myHeaders2.append("Accept", "application/json");

    const requestOptions2 = {
      method: "GET",
      headers: myHeaders,

      redirect: "follow",
    };

    async function addToOrderMetafields(metafields, orderId) {
      console.log("inside addtoordee: ");
      try {
        const bodyData = {
          permission_set: "write_and_sf_access",
          namespace: "FormData",
          key: "FormData",
          value: JSON.stringify(metafields), // Ensure formData is defined before using it
          description: "Name of staff member",
        };

        const response = await fetch(
          `https://api.bigcommerce.com/stores/eagnf01idv/v3/orders/${orderId}/metafields`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": "oe5uijwhafstu69o0vj50kr7q5jv5c7",
            },
            body: JSON.stringify(bodyData),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error adding metafield:", error);
        throw error; // Re-throw the error to be caught by the calling function
      }
    }

    const response2 = await fetch(
      `https://api.bigcommerce.com/stores/eagnf01idv/v3/carts/${cartId}/metafields`,
      requestOptions2
    );
    if (!response2.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response2.json();
    console.log(data);
    const metafields = data?.data;

    await addToOrderMetafields(metafields, orderid);

    res.json({ success: true });
  } catch (error) {
    console.error("There was an error with the fetch operation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/metafields/:cartid", (req, res) => {
  const cart_id = req.params.cartid;
  const myHeaders = new Headers();
  myHeaders.append("X-Auth-Token", "oe5uijwhafstu69o0vj50kr7q5jv5c7");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  const raw = JSON.stringify({
    permission_set: "write_and_sf_access",
    namespace: "Cart Metafields",
    key: "UPS",
    value: "Account Number",
    description: "Payment Method",
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    `https://api.bigcommerce.com/stores/{store_hash}/v3/carts/${cart_id}/metafields`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      res.json({ result });
    })
    .catch((error) => {
      console.error(error);
      res.send("error", error);
    });
});

// Define port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
