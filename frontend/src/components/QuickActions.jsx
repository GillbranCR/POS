import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Grid,
    Button,
    Stack,
  } from "@mui/material"
  import { PlusCircle, Receipt, BarChart, Tag } from "lucide-react"
  
  export default function QuickActions() {
    const actions = [
      { label: "New Sale", icon: <PlusCircle size={32} />, variant: "contained" },
      { label: "Receipts", icon: <Receipt size={32} />, variant: "outlined" },
      { label: "Reports", icon: <BarChart size={32} />, variant: "outlined" },
      { label: "Discounts", icon: <Tag size={32} />, variant: "outlined" },
    ]
  
    return (
      <Card sx={{maxHeight: 250}}>
        <CardHeader
          title="Quick Actions"
          subheader="Common POS operations"
        />
        <CardContent >
          <Grid container spacing={4}>
            {actions.map((action, index) => (
              <Grid item key={index}>
                <Button
                  variant={action.variant}
                  fullWidth
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