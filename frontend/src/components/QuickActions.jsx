import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Button,
} from "@mui/material"
import { PlusCircle, Receipt, BarChart, Tag } from "lucide-react"

export default function QuickActions({ router }) {
  const actions = [
    { label: "Nueva venta", icon: <PlusCircle size={32} />, variant: "contained", path: "/sales" },
    { label: "Facturas", icon: <Receipt size={32} />, variant: "outlined", path: "/invoices" },
    { label: "Reportes", icon: <BarChart size={32} />, variant: "outlined", path: "/reports/sales" },
    { label: "Ordenes", icon: <Tag size={32} />, variant: "outlined", path: "/orders" },
  ]

  return (
    <Card sx={{ maxHeight: 250, maxWidth: 435 }}>
      <CardHeader title="Acciones rápidas" subheader="Operaciones comunes" />
      <CardContent>
        <Grid container spacing={1}>
          {actions.map((action, index) => (
            <Grid item key={index}>
              <Button 
                variant={action.variant}
                fullWidth
                onClick={() => router.navigate(action.path)}
                sx={{
                  flexDirection: "column",
                  height: 96,
                  justifyContent: "center",
                  gap: 1,
                  textTransform: "none",
                }}
              >
                {action.icon}
                <Typography variant="body2">{action.label}</Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
