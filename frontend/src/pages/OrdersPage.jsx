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

  const [orders, setOrders] = useState([
    { id: 11, client_name: 'Cliente general', date: '2025-06-27T18:29:00', total: 35.00, status: 'pending', tax: 3.50 },
    { id: 10, client_name: 'Cliente general', date: '2025-06-26T07:23:00', total: 626.40, status: 'pending', tax: 62.64 },
    { id: 9, client_name: 'Cliente general', date: '2025-06-25T18:26:00', total: 255.20, status: 'completed', tax: 25.52 },
  ]);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  const getStatusChip = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? (
      <Chip label={option.label} color={option.color} size="small" />
    ) : (
      <Chip label={status || 'Desconocido'} size="small" />
    );
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.client_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDateFilter('all');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

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
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={(e) => setStatusFilter(e.target.value)}
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
              <FormControl fullWidth size="small">
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
                    {!isMobile && <TableCell>${order.total.toFixed(2)}</TableCell>}
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
                              <IconButton size="small" color="success">
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancelar orden">
                              <IconButton size="small" color="error">
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
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
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
                    <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
                  </Typography>
                  <Typography>
                    <strong>Impuesto:</strong> ${selectedOrder.tax.toFixed(2)}
                  </Typography>
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
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cerrar</Button>
            <Button onClick={handleClose} variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Your JSX remains the same */}
    </LocalizationProvider>
  );
}