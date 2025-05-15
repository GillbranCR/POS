import React, { useState, useEffect } from "react"
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState("")

  const API_URL = "http://localhost:8000/api/inventory/categories/"

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Error al cargar categorías:", error)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      })
      if (res.ok) {
        setNewCategory("")
        fetchCategories()
      } else {
        alert("No se pudo crear la categoría.")
      }
    } catch (error) {
      console.error("Error al crear categoría:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Crear nueva categoría
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <TextField
              fullWidth
              label="Nombre de categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" fullWidth onClick={handleAddCategory}>
              Crear
            </Button>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="h6">Categorías existentes:</Typography>
          <List>
            {categories.map((cat) => (
              <ListItem key={cat.id}>
                <ListItemText primary={cat.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  )
}

export default CategoriesPage
