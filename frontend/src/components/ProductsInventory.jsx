import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Chip,
    Divider,
    Stack,
  } from "@mui/material"
  
  const products = [
    {
      name: "Coffee - Medium Roast",
      stock: 24,
      status: "in-stock",
    },
    {
      name: "Espresso Beans",
      stock: 15,
      status: "in-stock",
    },
    {
      name: "Chai Tea Bags",
      stock: 3,
      status: "low-stock",
    },
    {
      name: "Vanilla Syrup",
      stock: 0,
      status: "out-of-stock",
    },
  ]
  
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
    return (
      <Card >
        <CardHeader
          title="Inventory Status"
          subheader="Monitor your product inventory"
        />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            {products.map((product) => (
              <Stack
                key={product.name}
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