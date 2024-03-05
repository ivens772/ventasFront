import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { parseCookies } from 'nookies';

interface Prop {
    children: ReactNode;
}

const RedirectIfNotAuthenticated = ({ children }: Prop) => {
    const router = useRouter();
    const { jwt } = parseCookies();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verifica si el usuario está autenticado
        if (!jwt || jwt === undefined) {
            router.push('/');
        } else {
            setIsAuthenticated(true);
        }
    }, []); // Se ejecuta solo una vez al montar el componente

    // Muestra el contenido solo después de que se haya completado la verificación de autenticación
    return isAuthenticated ? <>{children}</> : null;
};

export default RedirectIfNotAuthenticated;
