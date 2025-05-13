import React, { useEffect } from 'react';
import {
  Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, InputLabel, FormControl, TextField,
  TablePagination, Box,
} from '@mui/material';

export default function OrdersPage() {
  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleOpenDetails = (order) => {
    setSelectedOrder({ ...order });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleSave = () => {
    fetch(`http://localhost:8000/api/sales/sale/${selectedOrder.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: selectedOrder.status }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al guardar los cambios');
        return res.json();
      })
      .then((updatedOrder) => {
        const updated = orders.map((o) =>
          o.id === updatedOrder.id ? updatedOrder : o
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
    fetch('http://localhost:8000/api/sales/sale/')
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
                  <TableCell>{order.status || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenDetails(order)}
                    >
                      Ver Detalles
                    </Button>
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
                >
                  <MenuItem value="Pending">Pendiente</MenuItem>
                  <MenuItem value="Shipped">Enviado</MenuItem>
                  <MenuItem value="Cancelled">Cancelado</MenuItem>
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
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}





