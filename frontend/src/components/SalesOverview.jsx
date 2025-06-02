import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material"
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react"
import axios from "axios"

export default function SalesOverview() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/sales/report/overview/") // Asegúrate de que esta URL sea correcta
      .then((response) => {
        setData(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching overview data:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <CircularProgress />
  }

  if (!data) {
    return <Typography>Error al cargar los datos.</Typography>
  }

  const cardData = [
    {
      title: "Total Revenue",
      value: `$${data.total_revenue.toLocaleString()}`,
      description: `${data.revenue_change >= 0 ? "+" : ""}${data.revenue_change}% from last month`,
      icon: <DollarSign size={18} style={{ color: "#6b7280" }} />,
    },
    {
      title: "Sales",
      value: `+${data.sales_count}`,
      description: `${data.sales_change >= 0 ? "+" : ""}${data.sales_change}% from last month`,
      icon: <ShoppingBag size={18} style={{ color: "#6b7280" }} />,
    },
    {
      title: "Active Customers",
      value: `+${data.active_customers}`,
      description: `${data.customers_change >= 0 ? "+" : ""}${data.customers_change}% from last month`,
      icon: <Users size={18} style={{ color: "#6b7280" }} />,
    },
    {
      title: "Conversion Rate",
      value: `${data.conversion_rate}%`,
      description: `${data.conversion_change >= 0 ? "+" : ""}${data.conversion_change}% from last month`,
      icon: <TrendingUp size={18} style={{ color: "#6b7280" }} />,
    },
  ]

  return (
    <>
      {cardData.map((item, index) => (
        <Card key={index} sx={{ mb: 2, maxWidth: "300px" }}>
          <CardHeader
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              px: 5,
              pb: 0,
              pt: 3,
            }}
            title={
              <Typography variant="h5" color="text.secondary">
                {item.title}
              </Typography>
            }
            action={item.icon}
          />
          <CardContent sx={{ pt: 3 }}>
            <Typography variant="h4" fontWeight="bold">
              {item.value}
            </Typography>
            <Typography variant="caption2" color="text.secondary">
              {item.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

