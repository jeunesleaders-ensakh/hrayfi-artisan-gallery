
import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
     body: JSON.stringify({
        username: email, // renamed from email
        password,
      }),

    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.detail || 'Login failed');
      setIsLoading(false);
      return;
    }

    const data = await response.json();

    // Save tokens or user info (depends on your API response structure)
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    localStorage.setItem('artisanEmail', email);
    localStorage.setItem('artisanId', data.artisan.id.toString());
    localStorage.setItem('isAuthenticated', 'true');

    navigate(`/artisan/${data.artisan.id}`);
  } catch (error) {
    console.error('Login error:', error);
    alert('Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm sm:max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold bg-gradient-to-r from-terracotta to-teal bg-clip-text text-transparent">
                Hraifia
              </h1>
            </div>
            <CardTitle className="text-xl sm:text-2xl text-terracotta">Artisan Login</CardTitle>
            <p className="text-muted-foreground text-sm">
              Access your artisan dashboard
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium">Email or Username</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter email or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 w-10 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-terracotta to-teal hover:from-terracotta/90 hover:to-teal/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Loading...</>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-teal hover:text-teal/80 hover:underline font-medium">
                  Register as artisan
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
