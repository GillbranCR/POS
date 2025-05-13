import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Divider,
  Stack,
} from "@mui/material"
import axios from "axios"

const getStatus = (stock) => {
  if (stock === 0) return "out-of-stock"
  if (stock < 5) return "low-stock"
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

  return (
    <Card>
      <CardHeader
        title="Inventory Status"
        subheader="Monitor your product inventory"
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          {products.map((product) => (
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
        </Stack>
      </CardContent>
    </Card>
  )
}
