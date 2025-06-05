import React, { useEffect, useState } from 'react';
import {
  Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, InputLabel, FormControl, TextField,
  TablePagination, Box, Chip, Stack, IconButton, Tooltip,
  Card, CardContent, useMediaQuery, useTheme
} from '@mui/material';
import {
  Search, Refresh, Cancel, CheckCircle, Print, Download,
  Receipt, FilterAlt
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

export default function OrdersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [originalStatus, setOriginalStatus] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("return");
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Status options with colors
  const statusOptions = [
    { value: 'pending', label: 'Pendiente', color: 'warning' },
    { value: 'completed', label: 'Completado', color: 'success' },
    { value: 'cancelled', label: 'Cancelado', color: 'error' }
  ];

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

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

  const getStatusChip = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? (
      <Chip label={option.label} color={option.color} size="small" />
    ) : (
      <Chip label={status || 'Desconocido'} size="small" />
    );
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
    setCancelReason("return");
    setCancelDialogOpen(true);
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDateFilter('all');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.client_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: isMobile ? 1 : 3 }}>
        {/* Stats Cards - Responsive layout */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Órdenes
                </Typography>
                <Typography variant="h5">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Pendientes
                </Typography>
                <Typography variant="h5" color="warning.main">
                  {stats.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Completadas
                </Typography>
                <Typography variant="h5" color="success.main">
                  {stats.completed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Canceladas
                </Typography>
                <Typography variant="h5" color="error.main">
                  {stats.cancelled}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter Section */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems="center" mb={2}>
            <Typography variant="h6">Filtros</Typography>
            <Button
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              size={isMobile ? 'small' : 'medium'}
            >
              ACTUALIZAR
            </Button>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Buscar cliente"
                value={search}
                onChange={handleSearchChange}
                size="small"
                InputProps={{
                  startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small" sx={{minWidth: 100}}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small" sx={{minWidth: 140}}>
                <InputLabel>Rango de fechas</InputLabel>
                <Select
                  value={dateFilter}
                  label="Rango de fechas"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="today">Hoy</MenuItem>
                  <MenuItem value="week">Esta semana</MenuItem>
                  <MenuItem value="month">Este mes</MenuItem>
                  <MenuItem value="custom">Personalizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={resetFilters}
                startIcon={<FilterAlt />}
                size="small"
              >
                LIMPIAR FILTROS
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Orders Table */}
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Órdenes ({filteredOrders.length})
            </Typography>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Imprimir">
                <IconButton size="small">
                  <Print fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Exportar">
                <IconButton size="small">
                  <Download fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <TableContainer>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  {!isMobile && <TableCell>Cliente</TableCell>}
                  <TableCell>Fecha</TableCell>
                  {!isMobile && <TableCell>Total</TableCell>}
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    {!isMobile && <TableCell>{order.client_name}</TableCell>}
                    <TableCell>
                      {format(new Date(order.date), isMobile ? 'dd/MM' : 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    {!isMobile && <TableCell>${parseFloat(order.total).toFixed(2)}</TableCell>}
                    <TableCell>{getStatusChip(order.status)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDetails(order)}
                          >
                            <Receipt fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {order.status === 'pending' && (
                          <>
                            <Tooltip title="Completar orden">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => {
                                  setSelectedOrder({...order, status: 'completed'});
                                  handleSave();
                                }}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancelar orden">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleOpenCancelDialog(order)}
                              >
                                <Cancel fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Órdenes por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        </Paper>

        {/* Order Details Dialog */}
        <Dialog 
          open={open} 
          onClose={handleClose} 
          fullWidth 
          maxWidth={isMobile ? 'sm' : 'md'}
          fullScreen={isMobile}
        >
          <DialogTitle>
            Orden #{selectedOrder?.id}
          </DialogTitle>
          <DialogContent dividers>
            {selectedOrder && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Información del Cliente
                  </Typography>
                  <Typography>
                    <strong>Cliente:</strong> {selectedOrder.client_name}
                  </Typography>
                  <Typography>
                    <strong>Fecha:</strong> {format(new Date(selectedOrder.date), 'PPPPpppp')}
                  </Typography>
                  <Typography>
                    <strong>Total:</strong> ${parseFloat(selectedOrder.total).toFixed(2)}
                  </Typography>
                  {selectedOrder.tax && (
                    <Typography>
                      <strong>Impuesto:</strong> ${parseFloat(selectedOrder.tax).toFixed(2)}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Estado
                  </Typography>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={selectedOrder.status}
                      label="Estado"
                      onChange={(e) => setSelectedOrder({
                        ...selectedOrder,
                        status: e.target.value
                      })}
                      disabled={selectedOrder.status === 'cancelled' || selectedOrder.status === 'completed'}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Artículos
                  </Typography>
                  <ul>
                    {selectedOrder.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.product_name} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cerrar</Button>
            {(originalStatus !== 'cancelled' && originalStatus !== 'completed') && (
              <Button onClick={handleSave} variant="contained" color="primary">
                Guardar cambios
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Cancel Order Dialog */}
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
      </Box>
    </LocalizationProvider>
  );
}