import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Button,
  Box,
} from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function RecentTransactions( {router}) {
  const [anchorEls, setAnchorEls] = useState({})
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetch("http://localhost:8000/api/invoices/invoices/")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6) // Limita a 5 facturas más recientes
          .map((inv) => ({
            id: inv.invoice_number,
            customer: inv.client_name || "Cliente desconocido",
            amount: `$${parseFloat(inv.total).toFixed(2)}`,
            status: "completed",
            date: inv.date.slice(0, 10),
          }))
        setTransactions(formatted)
      })
      .catch((err) => {
        console.error("Error fetching invoices:", err)
      })
  }, [])

  const handleClick = (event, id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }))
  }

  const handleClose = (id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }))
  }

  const statusColor = (status) => {
    switch (status) {
      case "completed":
        return "success"
      case "processing":
        return "warning"
      case "failed":
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <Card>
      <CardHeader
        title="Recent Transactions"
        subheader={`Most recent 5 invoices`}
      />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.customer}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.status}
                    color={statusColor(transaction.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleClick(e, transaction.id)}>
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEls[transaction.id]}
                    open={Boolean(anchorEls[transaction.id])}
                    onClose={() => handleClose(transaction.id)}
                  >
                    <MenuItem onClick={() => handleClose(transaction.id)}>View</MenuItem>
                    <MenuItem onClick={() => handleClose(transaction.id)}>Download PDF</MenuItem>
                    <MenuItem onClick={() => handleClose(transaction.id)}>Send by email</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box display="flex" justifyContent="center" >
          <Button size="small" onClick={() => router.navigate("/invoices")}>
            Ver más
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}


