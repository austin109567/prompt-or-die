import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Process the OAuth callback
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Redirect to dashboard on successful authentication
        navigate('/dashboard', { replace: true });
      } catch (err: any) {
        console.error('Error during auth callback:', err);
        setError(err.message || 'Authentication failed');
        
        // Redirect to login page after a delay if there's an error
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {error ? (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-destructive">Authentication Failed</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p>Redirecting you back to login...</p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Completing Authentication</h1>
            <p className="text-muted-foreground">Please wait while we log you in...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;