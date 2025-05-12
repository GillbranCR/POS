import * as React from 'react';
import { createTheme, styled } from '@mui/material/styles';
import { Dashboard } from '@mui/icons-material';
import { ShoppingCart, PointOfSale, Inventory } from '@mui/icons-material';
import { BarChart } from '@mui/icons-material';
import { Description } from '@mui/icons-material';
import { Layers } from '@mui/icons-material';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import DashboardPage from '../pages/DashboardPage';
import SalesPage from '../pages/SalesPage';
import OrdersPage from '../pages/OrdersPage'; // Asegúrate de que la ruta sea correcta
import InventoryPage from '../pages/InventoryPage';



const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <Dashboard />,
  },
  {
    segment: 'sales',
    title: 'Sales',
    icon: <PointOfSale />
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCart />,
  },
  {
    segment: 'inventory',
    title: 'Inventory',
    icon: <Inventory />
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChart />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
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
    segment: 'integrations',
    title: 'Integrations',
    icon: <Layers />,
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

export default function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  const renderPageContent = () => {
    switch (router.pathname) {
      case '/dashboard':
        return (
          <DashboardPage />
        );
      case '/sales':
        return <SalesPage />;
      case '/orders':
        return <OrdersPage />;
      case '/inventory':
        return <InventoryPage />;
        
      // Aquí puedes agregar más cases para otras páginas si quieres.
      default:
        return <Skeleton height={400} />;
    }
  };

  // Remove this const when copying and pasting into your project.
  //const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      //window={demoWindow}
    >
      <DashboardLayout>
        <PageContainer>
          {renderPageContent()}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
