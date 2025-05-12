import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box,
  } from "@mui/material"
  import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react"
  
  const cardData = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      description: "+20.1% from last month",
      icon: <DollarSign size={18} style={{ color: "#6b7280" }} />, // muted-foreground
    },
    {
      title: "Sales",
      value: "+2350",
      description: "+10.5% from last month",
      icon: <ShoppingBag size={18} style={{ color: "#6b7280" }} />,
    },
    {
      title: "Active Customers",
      value: "+573",
      description: "+12.7% from last month",
      icon: <Users size={18} style={{ color: "#6b7280" }} />,
    },
    {
      title: "Conversion Rate",
      value: "24.5%",
      description: "+3.2% from last month",
      icon: <TrendingUp size={18} style={{ color: "#6b7280" }} />,
    },
  ]
  
  export default function SalesOverview() {
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