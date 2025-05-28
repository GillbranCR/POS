import React, { useEffect, useState } from 'react';
import {
  Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Dialog, DialogTitle,
  DialogContent, Button, Box
} from '@mui/material';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetch('http://localhost:8000/api/invoices/invoices/')
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(err => console.error("Error al cargar facturas", err));
  }, []);

  const handleOpenDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginatedInvoices = invoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Facturas Generadas
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.invoice_number}</TableCell>
                  <TableCell>{inv.client_name}</TableCell>
                  <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                  <TableCell>${parseFloat(inv.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenDialog(inv)} variant="outlined">
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay facturas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={invoices.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Facturas por página"
          />
        </TableContainer>
      </Grid>

      {/* Modal Detalles */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Factura: {selectedInvoice?.invoice_number}</DialogTitle>
        <DialogContent dividers>
          {selectedInvoice && (
            <Box>
              <Typography><strong>Emisor:</strong> {selectedInvoice.issuer_name}</Typography>
              <Typography><strong>Dirección Emisor:</strong> {selectedInvoice.issuer_address}</Typography>
              <Typography sx={{ mt: 2 }}><strong>Cliente:</strong> {selectedInvoice.client_name}</Typography>
              <Typography><strong>Dirección Cliente:</strong> {selectedInvoice.client_address}</Typography>
              <Typography sx={{ mt: 2 }}><strong>Fecha:</strong> {new Date(selectedInvoice.date).toLocaleString()}</Typography>
              <Typography sx={{ mt: 2 }}><strong>Subtotal:</strong> ${parseFloat(selectedInvoice.subtotal).toFixed(2)}</Typography>
              <Typography><strong>IVA:</strong> ${parseFloat(selectedInvoice.tax).toFixed(2)}</Typography>
              <Typography><strong>Total:</strong> ${parseFloat(selectedInvoice.total).toFixed(2)}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  );
}
