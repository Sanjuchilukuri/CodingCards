import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import ThemeContextProvider from './context/ThemeContext.tsx';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <ThemeContextProvider>
            <App />
        </ThemeContextProvider>
    </BrowserRouter>
)