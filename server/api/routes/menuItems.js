const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menuItem');
const Restaurant = require('../models/restaurant'); // Import the Restaurant model
const authenticate = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

// Update the 'Create a new menu item associated with a specific restaurant' route to save the menu item's ID in the restaurant's 'menu' field
router.post('/', authenticate, async (req, res) => {
    const { name, description, price, category, image, restaurantId } = req.body;

    try {
        // Check if the restaurant with restaurantId exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Create a new menu item and associate it with the restaurant
        const menuItem = new MenuItem({ name, description, price, category, image, restaurant: restaurantId });

        await menuItem.save();

        // Add the menuItem's ID to the restaurant's 'menu' field
        restaurant.menu.push(menuItem._id);
        await restaurant.save();

        res.status(201).json(menuItem);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// // Create a new menu item associated with a specific restaurant
// router.post('/', authenticate, async (req, res) => {
//     const { name, description, price, category, image, restaurantId } = req.body; // Include restaurantId in the request

//     try {
//         // Check if the restaurant with restaurantId exists
//         const restaurant = await Restaurant.findById(restaurantId);
//         if (!restaurant) {
//             return res.status(404).json({ error: 'Restaurant not found' });
//         }

//         // Create a new menu item and associate it with the restaurant
//         const menuItem = new MenuItem({ name, description, price, category, image, restaurant: restaurantId });

//         await menuItem.save();
//         res.status(201).json(menuItem);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Read all menu items
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();

        res.status(200).json(menuItems);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:token', async (req, res) => {
    const { token } = req.params;

    const decodedToken = jwt.verify(token, "your-secret-key");
    const userID = decodedToken._id;

    const user = await User.findById(userID);

    const restaurant = await Restaurant.findOne({ email: user.email });

    if(restaurant){
        const menuItems = await MenuItem.find({ restaurant: restaurant._id });

        res.status(200).json(menuItems);
    } else{
        res.status(404).json({ error: 'Restaurant not found' });
    }
});

// Read all menu items of a specific restaurant by restaurant ID
router.get('/by-restaurant/:restaurantId', async (req, res) => {
    const { restaurantId } = req.params;

    try {
        // Find the restaurant by its ID
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Find all menu items associated with the restaurant
        const menuItems = await MenuItem.find({ restaurant: restaurantId });
        res.status(200).json(menuItems);
    } catch (err) {
        console.error("Error in /by-restaurant/:restaurantId route: ", err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

module.exports = router;


// router.get('/by-restaurant', async (req, res) => {
//     const token = req.header('x-auth-token');

//     if (!token) {
//         return res.status(401).json({ error: 'Access denied. No token provided.' });
//     }

//     try {
//         const decodedToken = jwt.verify(token, "your-secret-key");
//         const userID = decodedToken._id;

//         const user = await User.findById(userID);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const restaurant = await Restaurant.findOne({ restaurant: restaurantId });
//         if (!restaurant) {
//             return res.status(404).json({ error: 'Restaurant not found' });
//         }

//         const menuItems = await MenuItem.find({ restaurant: restaurant._id });
//         res.status(200).json(menuItems);
//     } catch (err) {
//         console.error("Error in /by-restaurant route: ", err.message);
//         res.status(500).json({ error: 'Internal server error', details: err.message });
//     }
// });




// // Read all menu items of a specific restaurant by restaurant ID
// router.get('/by-restaurant', async (req, res) => {
//     const token = req.header('x-auth-token');
  
//     try {
//       // Verify the token and decode the user's email
//       const decodedToken = jwt.verify(token, "your-secret-key"); // Replace with your secret key
//       const userID = decodedToken._id;
//       const user = await User.findById(userID);
      
//       // Find the restaurant by its email
//       const restaurant = await Restaurant.findOne({ email: user.email });
      
//       if (!restaurant) {
//         return res.status(404).json({ error: 'Restaurant not found' });
//       }
      
//       // Get the restaurant ID
//       const restaurantId = restaurant._id.toString();
      
//       console.log(restaurantId);
//       // Find all menu items associated with the restaurant
//       const menuItems = await MenuItem.find({ restaurant: restaurantId });
  
//       res.status(200).json(menuItems);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });


// Update a menu item by ID
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image } = req.body;

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
        id,
        { name, description, price, category, image },
        { new: true }
    );

    res.json(updatedMenuItem);
});

// Delete a menu item by ID
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    await MenuItem.findByIdAndDelete(id);
    res.sendStatus(204);
});

module.exports = router;
