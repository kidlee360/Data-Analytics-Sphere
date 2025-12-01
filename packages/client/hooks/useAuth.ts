// client/hooks/useAuth.ts (Create this file)

import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        setIsLoading(true);
        const storedAuthData = localStorage.getItem('authData'); 

        if (storedAuthData) {
            const { token, expiry } = JSON.parse(storedAuthData);
            const currentTime = Date.now();

            if (currentTime > expiry) {
                // Token has EXPIRED
                localStorage.removeItem('authData');
                setIsAuthenticated(false);
            } else {
                // Token is VALID
                setIsAuthenticated(true);
            }
        }
        
        setIsLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('authData');
        setIsAuthenticated(false);
    };

    return { isAuthenticated, isLoading, logout };
};

export default useAuth;