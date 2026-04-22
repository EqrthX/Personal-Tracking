import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { LoadingSpinnerWrapper } from './components/LoadingSpinnerWrapper';
import { router } from './router';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LoadingProvider>
          <LoadingSpinnerWrapper />
          <RouterProvider router={router} />
        </LoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
