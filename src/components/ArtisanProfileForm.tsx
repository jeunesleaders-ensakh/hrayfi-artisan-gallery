import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Save, X, Upload } from 'lucide-react';

interface Region {
  id: number;
  name: string;
}

interface Artisan {
  id: number;
  name: string;
  email?: string;
  biography: string;
  phone: string;
  region: Region;
  main_image: string | null;
}

interface ArtisanProfileFormProps {
  artisan: Artisan;
  onUpdate: (updatedArtisan: Artisan) => void;
}

const ArtisanProfileForm = ({ artisan, onUpdate }: ArtisanProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [formData, setFormData] = useState({
    name: artisan.name,
    email: artisan.email || '',
    biography: artisan.biography,
    phone: artisan.phone,
    region: artisan.region.id.toString(),
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch regions for the select dropdown
    fetch('http://127.0.0.1:8000/api/regions/')
      .then(res => res.json())
      .then(data => setRegions(data.results))
      .catch(err => console.error('Failed to fetch regions:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access');
      
      // Create FormData for multipart form submission
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('biography', formData.biography);
      submitData.append('phone', formData.phone);
      submitData.append('region', formData.region);
      
      if (selectedImage) {
        submitData.append('main_image', selectedImage);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/artisans/${artisan.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (response.ok) {
        const updatedArtisan = await response.json();
        onUpdate(updatedArtisan);
        setIsEditing(false);
        setSelectedImage(null);
      } else {
        console.error('Failed to update artisan profile');
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating artisan profile:', error);
      alert('An error occurred while updating your profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: artisan.name,
      email: artisan.email || '',
      biography: artisan.biography,
      phone: artisan.phone,
      region: artisan.region.id.toString(),
    });
    setSelectedImage(null);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl">My Profile</CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

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
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography">Biography</Label>
              <Textarea
                id="biography"
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                rows={4}
                placeholder="Tell us about yourself and your craft..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                {selectedImage && (
                  <span className="text-sm text-muted-foreground">
                    {selectedImage.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {artisan.main_image && (
                <img
                  src={artisan.main_image}
                  alt={artisan.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold">{artisan.name}</h3>
                <p className="text-muted-foreground">{artisan.region.name}</p>
                <p className="text-sm text-muted-foreground">{artisan.email}</p>
                <p className="text-sm text-muted-foreground">{artisan.phone}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Biography</h4>
              <p className="text-muted-foreground line-clamp-3">{artisan.biography}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArtisanProfileForm;