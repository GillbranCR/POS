import * as React from 'react';
import axios from 'axios';
import { useEffect, useState } from "react"
import { createTheme, styled } from '@mui/material/styles';
import { Dashboard } from '@mui/icons-material';
import { ShoppingCart, PointOfSale, Inventory, LocalShipping, LibraryBooks, Warning } from '@mui/icons-material';
import { BarChart } from '@mui/icons-material';
import { Description } from '@mui/icons-material';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ToolbarActions } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import DashboardPage from '../pages/DashboardPage';
import SalesPage from '../pages/SalesPage';
import OrdersPage from '../pages/OrdersPage'; // Asegúrate de que la ruta sea correcta
import InventoryPage from '../pages/InventoryPage';
import CategoriesPage from '../pages/CategoriesPage';
import ReportsPage from '../pages/ReportsPage';
import SuppliersPage from '../pages/SuppliersPage';
import InvoicesPage from '../pages/InvoicesPage';
import { Badge, IconButton, Tooltip, Menu, MenuItem, ListItemText, ListItemIcon } from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"
import { NotificationsProvider, useNotifications} from '@toolpad/core/useNotifications';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Principales',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <Dashboard />,
  },
  {
    segment: 'sales',
    title: 'Ventas',
    icon: <PointOfSale />
  },
  {
    segment: 'orders',
    title: 'Ordenes',
    icon: <ShoppingCart />,
  },
  {
    segment: 'inventory',
    title: 'Inventario',
    icon: <Inventory />
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analisis',
  },
  {
    segment: 'reports',
    title: 'Reportes',
    icon: <BarChart />,
    children: [
      {
        segment: 'sales',
        title: 'Ventas',
        icon: <Description />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <Description />,
      },
    ],
  },
  {
    segment: 'invoices',
    title: 'Facturas',
    icon: <LibraryBooks />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Proveedores',
  },
  {
    segment: 'suppliers',
    title: 'Proveedores',
    icon: <LocalShipping />,
  },
];

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

function NotificationsHandler({ alerts }) {
  const notifications = useNotifications();
  const notifiedRef = React.useRef(new Set());
  const time = new Date().toLocaleString();
  

  useEffect(() => {
    if (Array.isArray(alerts) && alerts.length > 0) {
      alerts.forEach((product) => {
        const key = `stock-${product.id}`;
        if (!notifiedRef.current.has(key)) {
          notifications.show(`${product.name} tiene solo ${product.stock} unidades restantes. (${time})`, {
          key,
          severity: 'warning',
          autoHideDuration: 4000,
        });
          notifiedRef.current.add(key);
        }
      });
    }
  }, [alerts, notifications]);

  return null;
}

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [alerts, setAlerts] = useState([]);
  const [menuHasOpened, setMenuHasOpened] = useState(false);

  const [viewedNotifications, setViewedNotifications] = useState(() => {
    const stored = localStorage.getItem('viewedNotifications');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  

  const router = useDemoRouter('/dashboard');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuHasOpened(true);
  };
  
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  
    // Marcar productos como vistos después de cerrar el menú
    const newViewed = new Set(viewedNotifications);
    alerts.forEach((product) => {
      newViewed.add(product.id);
    });
    setViewedNotifications(newViewed);
  };
  

  useEffect(() => {
    localStorage.setItem('viewedNotifications', JSON.stringify([...viewedNotifications]));
  }, [viewedNotifications]);
  
  useEffect(() => {
    const fetchAlerts = () => {
      axios.get("http://localhost:8000/api/inventory/products/")
        .then((res) => {
          const lowStock = res.data.filter((p) => p.stock === 0 || p.stock < 30);
          setAlerts(lowStock);
        })
        .catch((err) => {
          console.error("Inventory fetch error", err);
        });
    };

    fetchAlerts(); // primera carga
    const interval = setInterval(fetchAlerts, 60000); // cada 60 segundos

    return () => clearInterval(interval);
  }, []);
  
  const renderPageContent = () => {
    const commonProps = { router };
  
    switch (router.pathname) {
      case '/dashboard':
        return <DashboardPage {...commonProps} />;
      case '/sales':
        return <SalesPage {...commonProps} />;
      case '/orders':
        return <OrdersPage {...commonProps} />;
      case '/inventory':
        return <InventoryPage {...commonProps} />;
      case '/categories':
        return <CategoriesPage {...commonProps} />;
      case '/reports/sales':
        return <ReportsPage {...commonProps} />;
      case '/invoices':
        return <InvoicesPage {...commonProps} />;
      case '/suppliers':
        return <SuppliersPage {...commonProps} />;
      default:
        return <Skeleton height={400} />;
    }
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
    >
    <NotificationsProvider
    slotProps={{
      snackbar: {
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      },
    }}
    >
    <NotificationsHandler alerts={alerts} />
    <DashboardLayout 
      branding={{ title: "Abarrotes", homeUrl: "/dashboard" }}
      slots={{
        toolbarActions: (anchorEl) => (
          <>
            <Tooltip title="Low stock alerts">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={menuOpen ? 'notifications-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? 'true' : undefined}
                >
                  <Badge
                    badgeContent={alerts.filter((p) => !viewedNotifications.has(p.id)).length}
                    color="error"
                  >
                    <NotificationsIcon />
                  </Badge>


                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                id="notifications-menu"
                open={menuOpen}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  },
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                {alerts.length === 0 ? (
                  <MenuItem disabled>No low stock alerts</MenuItem>
                ) : (
                  alerts.map((product) => (
                    <MenuItem
                      key={product.id}
                      sx={{
                        color: product.stock === 0 ? 'error.main' : 'inherit',
                        opacity: viewedNotifications.has(product.id) ? 0.6 : 1,
                      }}
                    >
                      <ListItemIcon>
                        <Warning color={product.stock === 0 ? 'error' : 'warning'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${product.name} tiene ${product.stock} unidades restantes.`}
                        secondary={`Stock: ${product.stock} | Categoría: ${product.category}`}
                      />
                    </MenuItem>


                  ))
                )}
              </Menu>
            <ToolbarActions />
          </>
        ),
      }}
    >
        <PageContainer>{renderPageContent()}</PageContainer>
      </DashboardLayout>
      </NotificationsProvider>
    </AppProvider>
  );
}
