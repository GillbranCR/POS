import React, { useEffect, useState } from "react"
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid
} from "@mui/material"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import axios from "axios"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const ReportesPage = () => {
  const [sales, setSales] = useState([])
  const [salesByDate, setSalesByDate] = useState([])
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    axios.get("http://localhost:8000/api/sales/sales/").then((res) => {
      console.log("API response:", res.data) // <-- inspecciona aquí
      setSales(res.data)
      processData(res.data)
    })
  }, [])
  

  const processData = (data) => {
    const dateMap = {}
    const productMap = {}

    data.forEach((sale) => {
      const date = new Date(sale.date).toLocaleDateString()
      dateMap[date] = (dateMap[date] || 0) + parseFloat(sale.total)

      sale.items.forEach((item) => {
        const name = item.product_name
        productMap[name] = (productMap[name] || 0) + item.quantity
      })
    })

    const dateList = Object.entries(dateMap)
  .map(([date, total]) => ({ date, total }))
  .sort((a, b) => new Date(a.date) - new Date(b.date)) // ← Orden ascendente

    const productList = Object.entries(productMap)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)

    setSalesByDate(dateList)
    setTopProducts(productList)
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth='xl'>
        <Typography variant="h4" gutterBottom>
          Reportes del Punto de Venta
        </Typography>
  
        <Grid container columns={2} spacing={6}>
          <Grid columnSpan={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Ventas por Fecha</Typography>
              <ResponsiveContainer width={480} height={400}>
                <LineChart data={salesByDate}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
  
          
          <Grid columnSpan={{ base: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Proporción de Productos Vendidos</Typography>
              <ResponsiveContainer width={480} height={400}>
                <PieChart>
                  <Pie
                    data={topProducts}
                    dataKey="quantity"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
        <Grid marginTop={5}>
          
            <Grid columnSpan={{ base: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6">Productos más Vendidos</Typography>
                  <ResponsiveContainer height={400}>
                    <BarChart data={topProducts}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantity" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
                    
            </Grid>
        <Grid>
        <Grid marginTop={5} columnSpan={{ base: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ventas Registradas
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Impuesto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.client_name}</TableCell>
                      <TableCell>{new Date(sale.date).toLocaleString()}</TableCell>
                      <TableCell>${parseFloat(sale.total).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(sale.tax).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}   

export default ReportesPage
