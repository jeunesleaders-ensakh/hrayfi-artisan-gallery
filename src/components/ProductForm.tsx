import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  artisanId: string;
  editingProduct?: any;
}

const ProductForm = ({ isOpen, onClose, onSave, artisanId, editingProduct }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    materials: "",
    dimensions: "",
    cultural_significance: "",
    category_id: "",
    region_id: "",
    price: "",
    main_image: null as File | null,
  });

  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data.results || data));

    fetch("http://127.0.0.1:8000/api/regions/")
      .then((res) => res.json())
      .then((data) => setRegions(data.results || data));
  }, []);

useEffect(() => {
  if (!isOpen) return; // only run when dialog is open

  if (editingProduct && categories.length && regions.length) {
    // EDIT mode
    setFormData({
      name: editingProduct.name || "",
      description: editingProduct.description || "",
      materials: editingProduct.materials || "",
      dimensions: editingProduct.dimensions || "",
      cultural_significance: editingProduct.cultural_significance || "",
      category_id: String(editingProduct.category?.id || editingProduct.category_id || ""),
      region_id: String(editingProduct.region?.id || editingProduct.region_id || ""),
      price: String(editingProduct.price || ""),
      main_image: null,
    });
  } else {
    // ADD mode — reset the form
    setFormData({
      name: "",
      description: "",
      materials: "",
      dimensions: "",
      cultural_significance: "",
      category_id: "",
      region_id: "",
      price: "",
      main_image: null,
    });
  }
}, [editingProduct, isOpen, categories, regions]);



  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      main_image: e.target.files?.[0] || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    data.append("artisan_id", String(artisanId));

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `http://127.0.0.1:8000/api/products/${editingProduct.id}/`
      : "http://127.0.0.1:8000/api/products/";

    try {
      const res = await fetch(url, {
        method,
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error details:", err);
        alert(err.detail || "Failed to save product");
      } else {
        const saved = await res.json();
        onSave(saved);
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Description</Label>
            <Input name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div>
            <Label>Materials</Label>
            <Input name="materials" value={formData.materials} onChange={handleChange} />
          </div>
          <div>
            <Label>Dimensions</Label>
            <Input name="dimensions" value={formData.dimensions} onChange={handleChange} />
          </div>
          <div>
            <Label>Cultural Significance</Label>
            <Input name="cultural_significance" value={formData.cultural_significance} onChange={handleChange} />
          </div>
          <div>
            <Label>Category</Label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select</option>
              {categories.map((cat: any) => (
                <option
                  key={cat.id}
                  value={String(cat.id)}
                  selected={String(cat.id) === formData.category_id} // force selection
                >
                  {cat.name}
                </option>
              ))}
            </select>

          </div>
          <div>
            <Label>Region</Label>
            <select
              name="region_id"
              value={formData.region_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select</option>
              {regions.map((region: any) => (
                <option
                  key={region.id}
                  value={String(region.id)}
                  selected={String(region.id) === formData.region_id}
                >
                  {region.name}
                </option>
              ))}
            </select>

          </div>
          <div>
            <Label>Price</Label>
            <Input name="price" type="number" value={formData.price} onChange={handleChange} required />
          </div>
          <div>
            <Label>Main Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <Button type="submit" className="w-full">
            {editingProduct ? "Update Product" : "Create Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
