import { ThemeContextProvider } from './ThemeContext';
import AirbnbContextProvider from './AirbnbContext';
const Provider = ({ children }) => {
    return (
        <ThemeContextProvider>
             <AirbnbContextProvider> 
                {children}
            </AirbnbContextProvider>
        </ThemeContextProvider>
    );
};

export default Provider;