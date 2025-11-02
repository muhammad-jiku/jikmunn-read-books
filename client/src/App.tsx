import { router } from '@/routes';
import { ThemeProvider } from '@components/theme/ThemeProvider';
import { store } from '@redux/store';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './styles/globals.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
