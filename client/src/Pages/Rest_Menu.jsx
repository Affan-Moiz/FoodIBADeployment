// Pages/Rest_Menu.jsx
import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MenuItem from '../Components/Rest_Menu/MenuItem';
import DealItem from '../Components/Rest_Menu/DealItem';
import EditItemDialog from '../Components/Rest_Menu/EditItemDialog';

const RestMenu = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Item 1', price: 10, quantity: 1 },
    { id: 2, name: 'Item 2', price: 15, quantity: 2 },
    // Add more menu items as needed
  ]);

  const [dealItems, setDealItems] = useState([
    { id: 1, name: 'Deal 1', description: 'Special Deal 1', price: 25 },
    { id: 2, name: 'Deal 2', description: 'Special Deal 2', price: 30 },
    // Add more deal items as needed
  ]);

  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleEditItemClick = (item) => {
    setCurrentItem(item);
    setEditItemDialogOpen(true);
  };

  const handleAddItemClick = () => {
    setCurrentItem(null);
    setEditItemDialogOpen(true);
  };

  const handleEditItemSubmit = (formData) => {
    // Implement logic to update or add item to the menu
    if (currentItem) {
      // Update existing item
      // Find the index of the current item in the menuItems array
      const index = menuItems.findIndex((item) => item.id === currentItem.id);
      const updatedMenuItems = [...menuItems];
      updatedMenuItems[index] = { ...currentItem, ...formData };
      setMenuItems(updatedMenuItems);
    } else {
      // Add new item
      const newItem = {
        id: menuItems.length + 1,
        ...formData,
      };
      setMenuItems([...menuItems, newItem]);
    }

    // Close the dialog
    setEditItemDialogOpen(false);
  };

  return (
    <div>
      <Typography variant="h4">Menu</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">Items</Typography>
          {menuItems.map((item) => (
            <div key={item.id}>
              <MenuItem {...item} />
              <Button onClick={() => handleEditItemClick(item)}>
                Edit Item
              </Button>
            </div>
          ))}
          <Button variant="contained" onClick={handleAddItemClick}>
            Add Item
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5">Deals</Typography>
          {dealItems.map((deal) => (
            <div key={deal.id}>
              <DealItem {...deal} />
              <Button onClick={() => handleEditItemClick(deal)}>
                Edit Deal
              </Button>
            </div>
          ))}
          <Button variant="contained" onClick={handleAddItemClick}>
            Add Deal
          </Button>
        </Grid>
      </Grid>

      <EditItemDialog
        open={editItemDialogOpen}
        handleClose={() => setEditItemDialogOpen(false)}
        handleSubmit={handleEditItemSubmit}
        currentItem={currentItem}
      />
    </div>
  );
};

export default RestMenu;
