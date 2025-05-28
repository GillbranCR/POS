import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [isCreating, setIsCreating] = useState(false); // Track create mode

  const API_URL = "http://localhost:8000/api/inventory/categories/";

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      if (res.ok) {
        setNewCategory("");
        setIsCreating(false); // Exit create mode after success
        fetchCategories();
      } else {
        alert("No se pudo crear la categoría.");
      }
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCategories();
      } else {
        alert("No se pudo eliminar la categoría.");
      }
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  const handleEditCategory = (id, name) => {
    setEditingId(id);
    setEditedName(name);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`${API_URL}${editingId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditedName("");
        fetchCategories();
      } else {
        alert("No se pudo actualizar la categoría.");
      }
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    }
  };

  const handleCancel = () => {
    if (editingId) {
      // Cancel editing mode
      setEditingId(null);
      setEditedName("");
    } else if (isCreating) {
      // Cancel creating mode
      setIsCreating(false);
      setNewCategory("");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Categorías
        </Typography>

        {/* Create new category section */}
        {isCreating ? (
          <>
            <Typography variant="h6" gutterBottom>
              Crear nueva categoría
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Nombre de categoría"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" fullWidth onClick={handleAddCategory}>
                  Guardar
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button variant="outlined" fullWidth onClick={handleCancel}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => setIsCreating(true)}
            sx={{ mb: 3 }}
          >
            Nueva categoría
          </Button>
        )}

        {/* Categories list */}
        <Box mt={4}>
          <Typography variant="h6">Categorías existentes:</Typography>
          <List>
            {categories.map((cat) => (
              <ListItem
                key={cat.id}
                secondaryAction={
                  editingId === cat.id ? (
                    <>
                      <IconButton edge="end" onClick={handleSaveEdit}>
                        <Save />
                      </IconButton>
                      <IconButton edge="end" onClick={handleCancel}>
                        <Cancel />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        edge="end"
                        onClick={() => handleEditCategory(cat.id, cat.name)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  )
                }
              >
                {editingId === cat.id ? (
                  <TextField
                    fullWidth
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  <ListItemText primary={cat.name} />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default CategoriesPage;