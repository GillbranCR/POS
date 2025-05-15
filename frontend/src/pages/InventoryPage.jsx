import React, { useState, useEffect } from "react"
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"

export default function InventoryPage({ router }) {

  const [inventory, setInventory] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",           
    stock: "",
    category: "",
    image_url: "",
  })
  const API_URL = "http://localhost:8000/api/inventory/products/"  // Ajusta si es necesario


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        setInventory(data)
      } catch (err) {
        console.error("Error al obtener el inventario:", err)
      }
    }
  
    fetchData()
  }, [])

  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://localhost:8000/api/inventory/categories/")
      const data = await res.json()
      setCategories(data)
    }
    fetchCategories()
  }, [])

  
  
  

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock) return
  
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          category: parseInt(newProduct.category),
          image_url: newProduct.image_url,
          sku: newProduct.sku,
        }),
      })
      const savedProduct = await res.json()
      setInventory(prev => [...prev, savedProduct])
      setNewProduct({ name: "", price: "", category: "", stock: "", image: "" })
    } catch (err) {
      console.error("Error al agregar producto:", err)
    }
  }
  
  
  

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/inventory/products/${id}/`, {
        method: "DELETE",
      })
      setInventory((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      alert("No se pudo eliminar el producto.")
    }
  }
  

  const handleUpdateStock = async (id, newStock) => {
    try {
      const updatedStock = parseInt(newStock)
      await fetch(`http://localhost:8000/api/inventory/products/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: updatedStock }),
      })
  
      setInventory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock: updatedStock } : item
        )
      )
    } catch (error) {
      console.error("Error al actualizar stock:", error)
      alert("No se pudo actualizar el stock.")
    }
  }
  

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">

        <Paper sx={{ p: 2, mb: 4 }}>
          <Button
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={() => router.navigate('/categories')}
          >
            Crear nueva categoría
          </Button>

          <Grid container spacing={6}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Nombre"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="sku"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  value={newProduct.category}
                  label="Categoría"
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="URL Imagen"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton color="primary" onClick={handleAddProduct}>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} width={50} />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={product.stock}
                      onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(product.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Box>
  )
}


