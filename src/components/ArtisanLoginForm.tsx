import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, X, Eye, EyeOff } from 'lucide-react';

interface Artisan {
  id: number;
  name: string;
  email?: string;
  biography: string;
  phone: string;
  region: {
    id: number;
    name: string;
  };
  main_image: string | null;
}

interface ArtisanLoginFormProps {
  artisan: Artisan;
  onUpdate: (updatedArtisan: Artisan) => void;
}

const ArtisanLoginForm = ({ artisan, onUpdate }: ArtisanLoginFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: artisan.email || '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access');
      
      const submitData = {
        email: formData.email,
        username: formData.username,
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      };

      const response = await fetch(`http://127.0.0.1:8000/api/artisans/${artisan.id}/change-password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const updatedArtisan = { ...artisan, email: formData.email };
        onUpdate(updatedArtisan);
        setIsEditing(false);
        setFormData({
          email: formData.email,
          username: formData.username,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        alert('Login credentials updated successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to update login credentials');
      }
    } catch (error) {
      console.error('Error updating login credentials:', error);
      alert('An error occurred while updating your login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      email: artisan.email || '',
      username: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsEditing(false);
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl">Login Credentials</CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Change Login Info
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter new username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-10 w-10 p-0 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-10 w-10 p-0 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Updating...' : 'Update Credentials'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Email</h4>
              <p className="text-muted-foreground">{artisan.email}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Username</h4>
              <p className="text-muted-foreground">View current username after updating</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Password</h4>
              <p className="text-muted-foreground">••••••••</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArtisanLoginForm;