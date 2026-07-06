import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProgressProvider } from '@/components/widgets/ProgressTracker';
import { AppRouter } from '@/routes/AppRouter';

function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;
