
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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

const ProductGrid = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

useEffect(() => {
  const fetchProducts = () => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/products/?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched products:', data);
        setProducts(data.results || []);
        setTotalProducts(data.count || 0);
        setHasNextPage(!!data.next);
        setHasPreviousPage(!!data.previous);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      });
  };

  fetchProducts();
}, [currentPage]);


  const categories = Array.from(new Set(products.map(p => p.category.name)));
  const regions = Array.from(new Set(products.map(p => p.region.name)));

  const filteredProducts = products
    .filter(product => {
      const categoryMatch = !selectedCategory || selectedCategory === 'all-categories' || product.category.name === selectedCategory;
      const regionMatch = !selectedRegion || selectedRegion === 'all-regions' || product.region.name === selectedRegion;
      
      // Enhanced search - search across all text fields
      const searchMatch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.materials.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.dimensions.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.cultural_significance.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && regionMatch && searchMatch;
    })
    .sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);

      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'newest':
          return b.id - a.id;
        default:
          return a.id - b.id;
      }
    });

  // Calculate total pages based on API response
  const itemsPerPage = 12; // API default
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters */}
        <div className="mb-6 sm:mb-8">
          <ProductFilters
            categories={categories}
            regions={regions}
            selectedCategory={selectedCategory}
            selectedRegion={selectedRegion}
            searchQuery={searchQuery}
            onCategoryChange={(category) => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
            onRegionChange={(region) => {
              setSelectedRegion(region);
              setCurrentPage(1);
            }}
            onSearchChange={(search) => {
              setSearchQuery(search);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} products on page {currentPage} of {totalPages}
                {totalProducts > 0 && ` (${totalProducts} total products)`}
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id.toString()}
                  name={product.name}
                  price={parseFloat(product.price)}
                  artisan={product.artisan.name}
                  rating={4.5}
                  reviewCount={Math.floor(Math.random() * 200) + 50}
                  image={product.main_image || '/placeholder.svg'}
                  category={product.category.name}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => hasPreviousPage && handlePageChange(currentPage - 1)}
                    className={!hasPreviousPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                    <PaginationNext 
                      onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
                      className={!hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search terms
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedRegion('');
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
