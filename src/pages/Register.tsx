
import { useEffect, useState } from 'react';
import { Eye, EyeOff, UserPlus, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';

interface Region {
  id: number;
  name: string;
}

const Register = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    email:'',
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
    biography: '',
    region_id: '',
    main_image: null as File | null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/regions/')
      .then((res) => res.json())
      .then((data) => setRegions(data.results))
      .catch((err) => console.error('Error fetching regions:', err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      main_image: e.target.files?.[0] || null
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('password', formData.password);
    data.append('name', formData.name);
    data.append('biography', formData.biography);
    data.append('region_id', formData.region_id);
    if (formData.main_image) {
      data.append('main_image', formData.main_image);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.detail || 'Registration failed');
      } else {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong.');
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
            <CardTitle className="text-xl sm:text-2xl text-terracotta">Join as Artisan</CardTitle>
            <p className="text-muted-foreground text-sm">
              Showcase your authentic crafts
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="artisan123"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="h-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+212 6 12 34 56 78"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="h-10 pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region_id" className="text-sm font-medium">Region</Label>
                <select
                  id="region_id"
                  name="region_id"
                  value={formData.region_id}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background"
                  required
                >
                  <option value="">-- Select Region --</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="biography" className="text-sm font-medium">Craft / Biography</Label>
                <Input
                  id="biography"
                  name="biography"
                  type="text"
                  placeholder="Pottery master in Marrakech"
                  value={formData.biography}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="main_image" className="text-sm font-medium">Profile Image</Label>
                <Input
                  id="main_image"
                  name="main_image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="h-10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleInputChange}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="h-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-10 w-10 p-0 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-terracotta to-teal hover:from-terracotta/90 hover:to-teal/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Creating Account...</>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-teal hover:text-teal/80 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Register;
