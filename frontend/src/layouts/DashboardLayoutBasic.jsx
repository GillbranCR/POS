import * as React from 'react';
import { createTheme, styled } from '@mui/material/styles';
import { Dashboard } from '@mui/icons-material';
import { ShoppingCart, PointOfSale, Inventory, Category, LocalShipping } from '@mui/icons-material';
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
import CategoriesPage from '../pages/CategoriesPage';
import ReportsPage from '../pages/ReportsPage';
import SuppliersPage from '../pages/SuppliersPage';



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
    segment: 'categories',
    title: 'Categories',
    icon: <Category />
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
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Suppliers',
  },
  {
    segment: 'suppliers',
    title: 'Suppliers',
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

export default function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

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
      case '/suppliers':
        return <SuppliersPage {...commonProps} />;
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
