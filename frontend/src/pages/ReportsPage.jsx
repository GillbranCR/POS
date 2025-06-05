import React, { useEffect, useState } from "react";
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
  Grid,
  TextField,
  MenuItem,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
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
} from "recharts";
import axios from "../services/axiosConfig";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ReportsPage = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [salesByDate, setSalesByDate] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  
  // Filter states
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/sales/sales/").then((res) => {
      console.log("API response:", res.data);
      setSales(res.data);
      setFilteredSales(res.data);
      processData(res.data);
    });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterType, startDate, endDate, searchTerm, sales]);

  const processData = (data) => {
    const dateMap = {};
    const productMap = {};

    data.forEach((sale) => {
      const date = new Date(sale.date).toLocaleDateString();
      dateMap[date] = (dateMap[date] || 0) + parseFloat(sale.total);

      sale.items.forEach((item) => {
        const name = item.product_name;
        productMap[name] = (productMap[name] || 0) + item.quantity;
      });
    });

    const dateList = Object.entries(dateMap)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const productList = Object.entries(productMap)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);

    setSalesByDate(dateList);
    setTopProducts(productList);
  };

  const applyFilters = () => {
    let filtered = [...sales];

    // Apply date filters
    if (filterType !== "all") {
      const now = new Date();
      let start = new Date();

      switch (filterType) {
        case "day":
          start.setHours(0, 0, 0, 0);
          break;
        case "week":
          start.setDate(start.getDate() - start.getDay());
          start.setHours(0, 0, 0, 0);
          break;
        case "month":
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          break;
        case "year":
          start.setMonth(0, 1);
          start.setHours(0, 0, 0, 0);
          break;
        case "custom":
          if (startDate && endDate) {
            filtered = filtered.filter((sale) => {
              const saleDate = new Date(sale.date);
              return saleDate >= startDate && saleDate <= endDate;
            });
          }
          break;
      }

      if (filterType !== "custom") {
        filtered = filtered.filter((sale) => {
          const saleDate = new Date(sale.date);
          return saleDate >= start;
        });
      }
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((sale) =>
        sale.client_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSales(filtered);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const resetFilters = () => {
    setFilterType("all");
    setStartDate(null);
    setEndDate(null);
    setSearchTerm("");
  };

  return (
    <Box sx={{ py: 4 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl">
          <Typography variant="h4" gutterBottom>
            Reportes del Punto de Venta
          </Typography>

          {/* Filter Controls */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Filtros de Ventas
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="filter-type-label">Periodo</InputLabel>
                  <Select
                    labelId="filter-type-label"
                    value={filterType}
                    label="Periodo"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="day">Hoy</MenuItem>
                    <MenuItem value="week">Esta semana</MenuItem>
                    <MenuItem value="month">Este mes</MenuItem>
                    <MenuItem value="year">Este año</MenuItem>
                    <MenuItem value="custom">Personalizado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {filterType === "custom" && (
                <>
                  <Grid item xs={12} md={3}>
                    <DatePicker
                      label="Fecha inicial"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <DatePicker
                      label="Fecha final"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Buscar cliente"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={resetFilters}
                  sx={{ mr: 2 }}
                >
                  Limpiar filtros
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Charts Grid */}
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Ventas por Fecha</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={salesByDate}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6">
                  Proporción de Productos Vendidos
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
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
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Productos más Vendidos</Typography>
                <ResponsiveContainer width="100%" height={400}>
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

          {/* Sales Table */}
          <Grid item xs={12} sx={{ mt: 5 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ventas Registradas ({filteredSales.length})
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
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.client_name}</TableCell>
                      <TableCell>
                        {new Date(sale.date).toLocaleString()}
                      </TableCell>
                      <TableCell>${parseFloat(sale.total).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(sale.tax).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Container>
      </LocalizationProvider>
    </Box>
  );
};

export default ReportsPage;