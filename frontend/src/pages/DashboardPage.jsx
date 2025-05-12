import * as React from 'react';
import Grid from '@mui/material/Grid';
import ProductsInventory  from '../components/ProductsInventory';
import SalesOverview from '../components/SalesOverview';
import QuickActions from '../components/QuickActions';
import RecentTransactions from '../components/RecentTransactions';

export default function DashboardPage(){
    return (
        <Grid container spacing={3} direction="row" maxWidth="100%">
            <Grid container spacing={6} direction="row">
                <SalesOverview />
                    <Grid container spacing={8}>
                        <RecentTransactions />
                        <Grid direction="column" container spacing={2}>
                            <QuickActions />
                            <ProductsInventory />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}