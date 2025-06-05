import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Divider,
  Stack,
  Pagination,
} from "@mui/material"
import axios from "../services/axiosConfig";


const getStatus = (stock) => {
  if (stock === 0) return "out-of-stock"
  if (stock < 30) return "low-stock"
  return "in-stock"
}

const getStatusColor = (status) => {
  switch (status) {
    case "in-stock":
      return "success"
    case "low-stock":
      return "warning"
    case "out-of-stock":
      return "error"
    default:
      return "default"
  }
}

export default function ProductsInventory() {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  useEffect(() => {
    axios.get("http://localhost:8000/api/inventory/products/")
      .then((response) => {
        const enriched = response.data.map((p) => ({
          ...p,
          status: getStatus(p.stock),
        }))
        setProducts(enriched)
      })
      .catch((error) => {
        console.error("Error fetching products:", error)
      })
  }, [])

  const pageCount = Math.ceil(products.length / itemsPerPage)
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  return (
    <Card>
      <CardHeader
        title="Estatus del inventario"
        subheader="Monitoreo de inventario"
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          {paginatedProducts.map((product) => (
            <Stack
              key={product.id}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <div>
                <Typography variant="body1" fontWeight={500}>
                  {product.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {product.stock} units available
                </Typography>
              </div>
              <Chip
                label={
                  product.status === "in-stock"
                    ? "In Stock"
                    : product.status === "low-stock"
                    ? "Low Stock"
                    : "Out of Stock"
                }
                color={getStatusColor(product.status)}
                variant="outlined"
              />
            </Stack>
          ))}

          {/* Paginación al final */}
          {pageCount > 1 && (
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="small"
              sx={{ alignSelf: "center", mt: 2 }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

