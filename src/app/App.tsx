// Main App Component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UploadPage } from '../modules/upload/UploadPage';
import { ClaimResultPage } from '../modules/claim-analysis/ClaimResultPage';
import { useClaimMachine } from '../hooks/useClaimMachine';
import { useState, useEffect } from 'react';

// Create React Query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});

function AppContent() {
    const { state, result, reset } = useClaimMachine();
    const [currentHash, setCurrentHash] = useState(window.location.hash);

    // Listen for hash changes
    useEffect(() => {
        const handleHashChange = () => {
            console.log('🔍 Hash changed to:', window.location.hash);
            setCurrentHash(window.location.hash);
        };
        
        console.log('🔍 Initial hash:', window.location.hash);
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Show results page when user explicitly navigates there
    if (state === 'success' && result && currentHash === '#results') {
        console.log('🔍 Showing results page - state:', state, 'hash:', currentHash);
        return <ClaimResultPage result={result} onReset={reset} />;
    }

    // Show upload page for all states (including success with preview)
    return <UploadPage />;
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContent />
        </QueryClientProvider>
    );
}
