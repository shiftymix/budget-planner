import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import BudgetPlanner from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BudgetPlanner />
  </StrictMode>
);