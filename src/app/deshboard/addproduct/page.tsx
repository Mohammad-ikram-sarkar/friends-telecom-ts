'use client';

import React, { useState, ChangeEvent } from 'react';

interface ProductFormData {
  brand: string;
  productName: string;
  price: string;
  availability: 'In Stock' | 'Out of Stock' | 'Pre-Order';
  sku: string;
  colors: string[];
  storageOptions: string[];
  accessories: string;
  deliveryTime: string;
  emiAvailable: boolean;
  specifications: string;
  productImages: FileList | null;
}

const AddProductPage: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    brand: '',
    productName: '',
    price: '',
    availability: 'In Stock',
    sku: '',
    colors: [],
    storageOptions: [],
    accessories: '',
    deliveryTime: '',
    emiAvailable: false,
    specifications: '',
    productImages: null
  });

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setFormData(prev => ({
        ...prev,
        [name]: files
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addColor = (): void => {
    if (selectedColor && !formData.colors.includes(selectedColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, selectedColor]
      }));
      setSelectedColor('');
    }
  };

  const removeColor = (colorToRemove: string): void => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }));
  };

  const addStorage = (): void => {
    if (selectedStorage && !formData.storageOptions.includes(selectedStorage)) {
      setFormData(prev => ({
        ...prev,
        storageOptions: [...prev.storageOptions, selectedStorage]
      }));
      setSelectedStorage('');
    }
  };

  const removeStorage = (storageToRemove: string): void => {
    setFormData(prev => ({
      ...prev,
      storageOptions: prev.storageOptions.filter(storage => storage !== storageToRemove)
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      if (!formData.brand || !formData.productName || !formData.price || !formData.sku) {
        alert('Please fill in all required fields');
        return;
      }

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'productImages' && value instanceof FileList) {
          Array.from(value).forEach(file => data.append('productImages', file));
        } else {
          data.append(key, String(value));
        }
      });

      console.log('Submitting form data:', formData);

      alert('Product added successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error adding product');
    }
  };

  const handleSaveDraft = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('productDraft', JSON.stringify(formData));
      alert('Draft saved successfully!');
    }
  };

  return (
    <div className="min-h-screen  py-4 px-4 sm:px-6 lg:px-8 w-full">
      <div className=" mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center sm:text-left flex justify-center">
          Add New Product
        </h1>

        <div className="space-y-6">
          {/* Basic Product Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g., Apple"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="e.g., iPhone 12 Pro (Apple Refurbished)"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (৳) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 60000"
            
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pre-Order">Pre-Order</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU Code *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="e.g., sku-1"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Time
              </label>
              <input
                type="text"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleInputChange}
                placeholder="e.g., 3-5 Days"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specifications
            </label>
            <textarea
              name="specifications"
              value={formData.specifications}
              onChange={handleInputChange}
              placeholder="e.g., A14 Bionic chip, 6.1‑inch display, 5G capable"
              rows={4}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
            />
          </div>

          {/* Colors Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Colors
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                value={selectedColor}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedColor(e.target.value)}
                placeholder="Enter color name"
                className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                onKeyDown={(e) => e.key === 'Enter' && addColor()}
              />
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-orange-500 text-white text-sm sm:text-base rounded-md hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                Add Color
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-gray-100 text-gray-700"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="ml-1 sm:ml-2 text-red-500 hover:text-red-700 text-sm sm:text-base"
                    aria-label={`Remove ${color}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Storage Options Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage Options
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                value={selectedStorage}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedStorage(e.target.value)}
                placeholder="Enter storage option (e.g., 128GB)"
                className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                onKeyDown={(e) => e.key === 'Enter' && addStorage()}
              />
              <button
                type="button"
                onClick={addStorage}
                className="px-4 py-2 bg-orange-500 text-white text-sm sm:text-base rounded-md hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                Add Storage
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.storageOptions.map((storage: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-gray-100 text-gray-700"
                >
                  {storage}
                  <button
                    type="button"
                    onClick={() => removeStorage(storage)}
                    className="ml-1 sm:ml-2 text-red-500 hover:text-red-700 text-sm sm:text-base"
                    aria-label={`Remove ${storage}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Included Accessories
            </label>
            <textarea
              name="accessories"
              value={formData.accessories}
              onChange={handleInputChange}
              placeholder="e.g., Apple USB-C to Lightning Cable (1 m)"
              rows={3}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
            />
          </div>

          {/* EMI Available */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="emiAvailable"
              id="emiAvailable"
              checked={formData.emiAvailable}
              onChange={handleInputChange}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="emiAvailable" className="ml-2 text-sm sm:text-base text-gray-700">
              EMI Available
            </label>
          </div>

          {/* Product Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <input
              type="file"
              name="productImages"
              multiple
              accept="image/*"
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Upload multiple product images (JPEG, PNG, etc.)
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
            <button
              onClick={handleSubmit}
              className="w-full sm:flex-1 bg-orange-500 text-white py-3 px-6 text-sm sm:text-base rounded-md hover:bg-orange-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 order-2 sm:order-1"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full sm:flex-1 bg-gray-200 text-gray-800 py-3 px-6 text-sm sm:text-base rounded-md hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 order-1 sm:order-2"
            >
              Save as Draft
            </button>
          </div>
        </div>

        {/* Display Current Form Data */}
        <div className="mt-8 p-4 bg-gray-50 rounded-md hidden lg:block">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Current Form Data:</h3>
          <pre className="text-sm text-gray-600 overflow-auto whitespace-pre-wrap max-h-64">
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
