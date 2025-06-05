import React, { useEffect, useState } from "react"
import axios from "../services/axiosConfig"

import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Snackbar, 
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material"

const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState([])
    const [purchases, setPurchases] = useState([])
    const [selectedPurchase, setSelectedPurchase] = useState(null)
    const [formOpen, setFormOpen] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState(null)
    const [form, setForm] = useState({
        name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: ""
    })
    const [purchaseFormOpen, setPurchaseFormOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [newPurchase, setNewPurchase] = useState({
      supplier: "",
      status: "pending",
      notes: "",
      items: []
    })
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [formError, setFormError] = useState("")



  useEffect(() => {
    axios.get("http://localhost:8000/api/suppliers/suppliers/")
      .then(res => setSuppliers(res.data))

    axios.get("http://localhost:8000/api/suppliers/purchases/")
      .then(res => setPurchases(res.data))
    axios.get("http://localhost:8000/api/inventory/products/")
      .then(res => setProducts(res.data))
    
  }, [])

  const handleOpenPurchase = (id) => {
    axios.get(`http://localhost:8000/api/suppliers/purchases/${id}/`)
      .then(res => setSelectedPurchase(res.data))
  }

  const handleCloseDialog = () => {
    setSelectedPurchase(null)
  }

  const handleOpenForm = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier)
      setForm(supplier)
    } else {
      setEditingSupplier(null)
      setForm({
        name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: ""
      })
    }
    setFormOpen(true)
  }
  
  const handleCloseForm = () => {
    setFormOpen(false)
    setEditingSupplier(null)
  }
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  
  const handleSaveSupplier = async () => {
    try {
      if (editingSupplier) {
        await axios.put(`http://localhost:8000/api/suppliers/suppliers/${editingSupplier.id}/`, form)
      } else {
        await axios.post("http://localhost:8000/api/suppliers/suppliers/", form)
      }
      const res = await axios.get("http://localhost:8000/api/suppliers/suppliers/")
      setSuppliers(res.data)
      handleCloseForm()
    } catch (err) {
      console.error(err)
    }
  }
  
  const handleDeleteSupplier = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este proveedor?")) {
      await axios.delete(`http://localhost:8000/api/suppliers/suppliers/${id}/`)
      setSuppliers(suppliers.filter((s) => s.id !== id))
    }
  }

  const handleOpenPurchaseForm = () => {
    setNewPurchase({
      supplier: "",
      status: "pending",
      notes: "",
      items: []
    })
    setFormError("")
    setPurchaseFormOpen(true)
  }
  
  const handleAddItemToPurchase = () => {
    setNewPurchase(prev => ({
      ...prev,
      items: [...prev.items, { product: "", quantity: 1, unit_price: 0 }]
    }))
  }
  
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newPurchase.items]
    updatedItems[index][field] = value
    setNewPurchase({ ...newPurchase, items: updatedItems })
  }
  
  const handleSavePurchase = async () => {
    if (!newPurchase.supplier) {
      setFormError("Seleccione un proveedor.")
      return
    }
    if (newPurchase.items.length === 0) {
      setFormError("Agregue al menos un producto.")
      return
    }
    if (newPurchase.items.some(item => !item.product || item.quantity <= 0 || item.unit_price <= 0)) {
      setFormError("Verifique los productos, cantidades y precios.")
      return
    }
    
    try {
        console.log(newPurchase)
      await axios.post("http://localhost:8000/api/suppliers/purchases/", newPurchase)
      const res = await axios.get("http://localhost:8000/api/suppliers/purchases/")
      setPurchases(res.data)
      
      setPurchaseFormOpen(false)
      setSnackbar({ open: true, message: "Compra registrada correctamente", severity: "success" })
    } catch (err) {
      console.error(err)
      setSnackbar({ open: true, message: "Error al guardar la compra", severity: "error" })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }
  
  
  
  

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" onClick={() => handleOpenForm()}>Nuevo Proveedor</Button>
        </Box>
        <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="contained" onClick={handleOpenPurchaseForm}>Nueva Compra</Button>
        </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
            
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Lista de Proveedores</Typography>
            

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Telefono</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Direccion</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.contact_person}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.adress}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleOpenForm(s)}>Editar</Button>
                      <Button size="small" color="error" onClick={() => handleDeleteSupplier(s.id)}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>

            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Compras Registradas</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.supplier_name}</TableCell>
                    <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                    <TableCell>${parseFloat(p.total).toFixed(2)}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenPurchase(p.id)}>Ver</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={Boolean(selectedPurchase)} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Detalle de Compra</DialogTitle>
        <DialogContent>
          {selectedPurchase ? (
            <>
              <Typography variant="subtitle1">Proveedor: {selectedPurchase.supplier_name}</Typography>
              <Typography variant="body2">Fecha: {new Date(selectedPurchase.date).toLocaleString()}</Typography>
              <Typography variant="body2">Estado: {selectedPurchase.status}</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>Productos:</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedPurchase.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${parseFloat(item.unit_price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nombre" name="name" value={form.name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Contacto" name="contact_person" value={form.contact_person} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Teléfono" name="phone" value={form.phone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Dirección" name="address" value={form.address} onChange={handleChange} />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button onClick={handleCloseForm}>Cancelar</Button>
            <Button onClick={handleSaveSupplier} variant="contained" sx={{ ml: 2 }}>
              Guardar
            </Button>
          </Box>
        </DialogContent>
    </Dialog>
    <Dialog open={purchaseFormOpen} onClose={() => setPurchaseFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nueva Compra</DialogTitle>
        <DialogContent>
            {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {formError}
                </Alert>
            )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ minWidth: 120 }}>
              <InputLabel id="supplier-label">Proveedor</InputLabel>
              <Select
                labelId="supplier-label"
                
                value={newPurchase.supplier}
                label="Proveedor"
                onChange={(e) =>
                  setNewPurchase({ ...newPurchase, supplier: e.target.value })
                }
              >
                <MenuItem value="">
                  <em>Seleccione un proveedor</em>
                </MenuItem>
                {suppliers.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Notas"
                name="notes"
                value={newPurchase.notes}
                onChange={(e) => setNewPurchase({ ...newPurchase, notes: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1">Productos</Typography>
              {newPurchase.items.map((item, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                  <Grid item xs={5}>
                  <FormControl fullWidth sx={{ minWidth: 120 }}>
                    <InputLabel id={`product-label-${index}`}>Producto</InputLabel>
                    <Select
                      labelId={`product-label-${index}`}
                      value={item.product}
                      label="Producto"
                      onChange={(e) => handleItemChange(index, "product", e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Seleccione</em>
                      </MenuItem>
                      {products.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Cantidad"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Precio Unitario"
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button onClick={handleAddItemToPurchase} sx={{ mt: 1 }}>
                Agregar Producto
              </Button>
            </Grid>
          </Grid>
          
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button onClick={() => setPurchaseFormOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePurchase} variant="contained" sx={{ ml: 2 }}>
              Guardar Compra
            </Button>
          </Box>
        </DialogContent>
    </Dialog>
    <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
            {snackbar.message}
        </Alert>
    </Snackbar>


    </Container>
    
  )
}

export default SuppliersPage
