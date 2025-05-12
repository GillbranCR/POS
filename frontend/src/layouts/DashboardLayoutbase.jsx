import * as React from 'react';
import { Box, AppBar, Toolbar, Button, IconButton, Typography, InputBase, Badge, colors } from '@mui/material';
import { Menu, Search, Email, Notifications, AccountCircle } from '@mui/icons-material';

export default function DashboardLayoutbase(){
    return (
        <Box>
            
            <AppBar>
                <Toolbar>
                    <IconButton 
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}>
                        <Menu />
                    </IconButton>
                    <Typography>
                        Dashboard
                    </Typography>
                    <Box borderRadius={3} sx={{backgroundColor: 'ButtonHighlight', ml: 10}}>
                        <InputBase 
                        placeholder='Search'
                        sx={{ml: 2 }}
                        />
                        <IconButton>
                            <Search />
                        </IconButton>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box>
                        <IconButton>
                            <Badge badgeContent={17} color='error'><Email/></Badge>
                        </IconButton>
                        <IconButton>
                            <Badge badgeContent={3} color='error'><Notifications/></Badge>
                        </IconButton>
                        <IconButton>
                            <AccountCircle/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}