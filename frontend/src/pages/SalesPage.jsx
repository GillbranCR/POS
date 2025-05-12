import React, { useState, useEffect } from "react"
import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Divider,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

const SalesPage = () => {
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setCategories(["All", ...new Set(data.map((p) => p.category))])
      })
      .catch((err) => console.error("Error al cargar productos:", err))
  }, [])

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert("Producto sin stock disponible")
      return
    }

    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id)
      if (exists) {
        if (exists.quantity + 1 > product.stock) {
          alert("Stock insuficiente")
          return prev
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, { product, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (id, quantity) => {
    const product = products.find((p) => p.id === id)
    if (quantity > product.stock) {
      alert("Stock insuficiente")
      return
    }

    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id))
  }

  const clearCart = () => setCart([])

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const tax = subtotal * 0.16
  const total = subtotal + tax

  const finalizarCompra = async () => {
    try {
      for (const item of cart) {
        const newStock = item.product.stock - item.quantity

        await fetch(`http://localhost:8000/api/products/${item.product.id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stock: newStock }),
        })
      }

      alert("¡Compra realizada!")
      clearCart()

      // Recargar productos desde el backend con el stock actualizado
      const res = await fetch("http://localhost:8000/api/products/")
      const updated = await res.json()
      setProducts(updated)
    } catch (error) {
      console.error("Error al finalizar la compra:", error)
      alert("Ocurrió un error al procesar la compra.")
    }
  }

  const submitSale = async () => {
    const saleData = {
      client_name: "Cliente general", // Puedes cambiarlo si quieres un input luego
      items: cart.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      })),
      total: subtotal + tax,
      tax: tax,
    }
  
    try {
      const res = await fetch("http://localhost:8000/api/sales/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      })
      console.log(saleData)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || "Error al procesar venta")
      }
  
      alert("¡Compra realizada!")
      clearCart()
  
      // Recargar productos actualizados
      const updatedRes = await fetch("http://localhost:8000/api/products/")
      const updatedData = await updatedRes.json()
      setProducts(updatedData)
    } catch (err) {
      console.error("Error al enviar venta:", err)
      alert("Error: " + err.message)
    }
  }
  
  

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid md={4}>
              <TextField
                fullWidth
                label="Search Product"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {categories.length > 0 && (
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Grid>

          </Grid>
        </Box>

        <Grid container spacing={7}>
          {/* Productos */}
          <Paper sx={{ p: 2, width: 600 }}>
            <Typography variant="h6" gutterBottom>
              Productos
            </Typography>
            <List>
              {filteredProducts.map((product) => (
                <ListItem
                  key={product.id}
                  secondaryAction={
                    <Button
                      variant="contained"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      Agregar
                    </Button>
                  }
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                  <ListItemText
                    primary={`${product.name} (${product.stock} disponibles)`}
                    secondary={`$${Number(product.price).toFixed(2)}`}

                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Carrito */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: 400,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Carrito
              </Typography>
              <List dense>
                {cart.map((item) => (
                  <ListItem key={item.product.id} disablePadding>
                    <ListItemText
                      primary={`${item.product.name} x${item.quantity}`}
                      secondary={`$${(item.product.price * item.quantity).toFixed(2)}`}
                    />
                    <TextField
                      size="medium"
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.product.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      sx={{ width: 90, mx: 1 }}
                    />
                    <IconButton
                      edge="end"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mt: "auto" }}>
                <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
                <Typography>Taxes (16%): ${tax.toFixed(2)}</Typography>
                <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={submitSale}
                  disabled={cart.length === 0}
                >
                  Finalizar compra
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default SalesPage

