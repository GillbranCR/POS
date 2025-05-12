import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Menu,
    MenuItem,
    Chip,
  } from "@mui/material"
  import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
  import { useState } from "react"
  
  const transactions = [
    { id: "INV-001", customer: "John Doe", items: 5, amount: "$125.99", status: "completed", date: "2023-04-23" },
    { id: "INV-002", customer: "Jane Smith", items: 2, amount: "$42.50", status: "completed", date: "2023-04-23" },
    { id: "INV-003", customer: "Robert Johnson", items: 8, amount: "$189.75", status: "processing", date: "2023-04-23" },
    { id: "INV-004", customer: "Emily Davis", items: 3, amount: "$67.25", status: "completed", date: "2023-04-22" },
    { id: "INV-005", customer: "Michael Wilson", items: 1, amount: "$12.99", status: "failed", date: "2023-04-22" },
  ]
  
  export default function RecentTransactions() {
    const [anchorEls, setAnchorEls] = useState({})
  
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
          return "error"
        default:
          return "default"
      }
    }
  
    return (
      <Card >
        <CardHeader
          title="Recent Transactions"
          subheader={`You have ${transactions.length} transactions today`}
        />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>{transaction.items}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
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
                      <MenuItem onClick={() => handleClose(transaction.id)}>View details</MenuItem>
                      <MenuItem onClick={() => handleClose(transaction.id)}>Print receipt</MenuItem>
                      <MenuItem onClick={() => handleClose(transaction.id)}>Refund transaction</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }