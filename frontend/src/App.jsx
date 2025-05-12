import { useState } from 'react';
import './App.css';
import DashboardLayout from './layouts/DashboardLayoutbase';
import DashboardLayoutBasic from './layouts/DashboardLayoutBasic';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DashboardLayoutBasic/>
    </>
  )
}

export default App;
