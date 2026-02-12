
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';

interface Region {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Artisan {
  id: number;
  name: string;
  biography: string;
  region: Region;
  main_image: string | null;
}

interface Product {
  id: number;
  name: string;
  description: string;
  materials: string;
  dimensions: string;
  cultural_significance: string;
  category: Category;
  region: Region;
  artisan: Artisan;
  main_image: string | null;
  price: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  console.log('ProductDetails id param:', id);
  useEffect(() => {
  if (!id) {
    console.error('No product ID found in URL');
    setLoading(false);
    return;
  }
  setLoading(true);
  fetch(`http://127.0.0.1:8000/api/products/${id}/`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      setProduct(data);
      setLoading(false);
      console.log('Fetched product:', data);
    })
    .catch((err) => {
      console.error('Failed to fetch product:', err);
      setLoading(false);
    });
}, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Product not found</h1>
              <Button onClick={() => navigate('/')}>
                Back to Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.price);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.main_image || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground mb-4">
                by <button 
                  onClick={() => navigate(`/artisan/${product.artisan.id}/products`)}
                  className="text-primary hover:underline"
                >
                  {product.artisan.name}
                </button>
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-primary">
                ${price}
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>

            {/* Dimensions */}
            <div className="space-y-2">
              <h4 className="font-semibold">Dimensions</h4>
              <p className="text-muted-foreground text-sm sm:text-base">{product.dimensions}</p>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Cultural Significance */}
          {product.cultural_significance && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  Cultural Significance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {product.cultural_significance}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Materials */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm sm:text-base">
                {product.materials}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Artisan Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              Artisan Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-1">Artisan</h4>
                <button 
                  onClick={() => navigate(`/artisan/${product.artisan.id}/products`)}
                  className="text-primary hover:underline text-sm sm:text-base"
                >
                  {product.artisan.name}
                </button>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">{product.artisan.biography}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Region</h4>
                <p className="text-muted-foreground text-sm sm:text-base">{product.region.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Chatbot />
    </div>
  );
};

export default ProductDetails;
