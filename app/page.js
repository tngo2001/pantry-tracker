"use client"

import { Box, Stack, Typography, Button, Modal, TextField, Card, CardContent } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#333',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = docs.docs.map(doc => ({ name: doc.id, ...doc.data() }));
    setPantry(pantryList);
    setFilteredItems(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredItems(pantry);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = pantry.filter(({ name }) => name.toLowerCase().includes(lowerCaseQuery));
      setFilteredItems(filtered);
    }
  }, [searchQuery, pantry]);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item.toLowerCase());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={3}
      gap={2}
      bgcolor="#121212"
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-item-modal-title"
      >
        <Box sx={style}>
          <Typography id="add-item-modal-title" variant="h6" component="h2" color="white">
            Add Item
          </Typography>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{ input: { color: 'white' }, label: { color: 'white' } }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box
        width="100%"
        maxWidth="800px"
        height="100%"
        display="flex"
        flexDirection="column"
        mb={3}
      >
        <Box
          width="100%"
          bgcolor="#0288D1"
          color="white"
          p={2}
          borderRadius={2}
          mb={2}
        >
          <Typography variant="h4" textAlign="center">
            Pantry Items
          </Typography>
        </Box>

        <TextField
          id="search"
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, backgroundColor: '#333' }}
        />

        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Stack spacing={2}>
            {filteredItems.map(({ name, count }) => (
              <Card key={name} sx={{ bgcolor: '#2C2C2C', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CardContent>
                  <Typography variant="h6" color="white">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="body1" color="white">
                    Quantity: {count}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Card>
            ))}
          </Stack>
        </Box>

        <Button
          variant="contained"
          color="success"
          onClick={handleOpen}
          sx={{ mt: 2 }}
        >
          Add Item
        </Button>
      </Box>
    </Box>
  );
}
