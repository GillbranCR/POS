import React, { useEffect } from 'react';
import {
  Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, InputLabel, FormControl, TextField,
  TablePagination, Box, Chip
} from '@mui/material';

export default function OrdersPage() {
  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [originalStatus, setOriginalStatus] = React.useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("return");
  const [orderToCancel, setOrderToCancel] = React.useState(null);
  

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pendiente" color="warning" />;
      case 'completed':
        return <Chip label="Enviado" color="success" />;
      case 'cancelled':
        return <Chip label="Cancelado" color="error" />;
      default:
        return <Chip label={status || 'Desconocido'} />;
    }
  };

  
  const handleOpenDetails = (order) => {
    setSelectedOrder({ ...order });
    setOriginalStatus(order.status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleSave = () => {
    fetch(`http://localhost:8000/api/sales/sales/${selectedOrder.id}/update_status/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: selectedOrder.status
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al guardar los cambios');
        return res.json();
      })
      .then((response) => {
        const updated = orders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: selectedOrder.status } : o
        );
        setOrders(updated);
        setOpen(false);
      })
      .catch((err) => console.error(err));
  };
  

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.client_name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetch('http://localhost:8000/api/sales/sales/')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setOrders(data);
      })
      .catch(error => {
        console.error("Error al obtener órdenes:", error);
      });
  }, []);

  const cancelarVenta = async (id, reason = "return") => {
    try {
      const res = await fetch(`http://localhost:8000/api/sales/sales/${id}/update_status/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled", cancel_reason: reason }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Error al cancelar venta");
      }
  
      alert("Venta cancelada");
      // Actualizar lista
      setOrders((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "cancelled" } : s))
      );
    } catch (err) {
      console.error("Error:", err);
      alert("Error al cancelar venta");
    }
  };

  const handleOpenCancelDialog = (order) => {
    setOrderToCancel(order);
    setCancelReason("return"); // valor por defecto
    setCancelDialogOpen(true);
  };
  
  

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display='flex' gap={2} mb={2}>
          <TextField
            label="Buscar por cliente"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
          />
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={statusFilter}
              label="Estado"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Pending">Pendiente</MenuItem>
              <MenuItem value="Shipped">Enviado</MenuItem>
              <MenuItem value="Cancelled">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ width: 1100 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.client_name}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>${parseFloat(order.total).toFixed(2)}</TableCell>
                  <TableCell>{getStatusChip(order.status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenDetails(order)}
                      sx={{ mr: 1 }}
                    >
                      Ver Detalles
                    </Button>
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleOpenCancelDialog(order)}
                      >
                        Cancelar
                      </Button>
                    
                    )}

                  </TableCell>

                </TableRow>
              ))}
              {paginatedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No se encontraron órdenes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Órdenes por página"
          />
        </TableContainer>
      </Grid>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Detalles del pedido</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Typography>ID: {selectedOrder.id}</Typography>
              <Typography>Cliente: {selectedOrder.client_name}</Typography>
              <Typography>Fecha: {selectedOrder.date}</Typography>
              <Typography>Total: ${parseFloat(selectedOrder.total).toFixed(2)}</Typography>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={selectedOrder.status || ''}
                  label="Estado"
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      status: e.target.value,
                    })
                  }
                  disabled={selectedOrder.status === 'cancelled' || selectedOrder.status === 'completed'}
                >
                  <MenuItem value="pending">Pendiente</MenuItem>
                  <MenuItem value="completed">Enviado</MenuItem>
                </Select>
              </FormControl>

              <Typography sx={{ mt: 3 }}>Artículos:</Typography>
              <ul>
                {selectedOrder.items?.map((item, idx) => (
                  <li key={idx}>
                    {item.product_name} x{item.quantity}
                  </li>
                ))}
              </ul>
            </>
          )}
        </DialogContent>
        

        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          {(originalStatus !== 'cancelled' && originalStatus !== 'completed') && (
            <Button onClick={handleSave} variant="contained">
              Guardar cambios
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
          <DialogTitle>Cancelar orden</DialogTitle>
          <DialogContent dividers>
            <Typography>Selecciona el motivo de la cancelación:</Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Motivo</InputLabel>
              <Select
                value={cancelReason}
                label="Motivo"
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <MenuItem value="return">Devolución del cliente</MenuItem>
                <MenuItem value="error">Cancelación por error</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialogOpen(false)}>Cerrar</Button>
            <Button
              color="error"
              variant="contained"
              onClick={async () => {
                await cancelarVenta(orderToCancel.id, cancelReason);
                setCancelDialogOpen(false);
              }}
            >
              Confirmar Cancelación
            </Button>
          </DialogActions>
        </Dialog>
    </Grid>
  );
}





