// client/hooks/useAuth.ts (Create this file)

import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // 1. Get Token: Retrieve the token from localStorage
        const token = localStorage.getItem('token'); 

        if (token) {
            // 2. Minimal Check: For a quick check, just ensure the token exists. 
            //    A true check would involve sending the token to the API (e.g., /api/auth/verify)
            //    to ensure it's not expired or tampered with.
            setIsAuthenticated(true);
        }
        
        setIsLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return { isAuthenticated, isLoading, logout };
};

export default useAuth;