'use client';

import React, { useState, ChangeEvent } from 'react';
import { Plus, X, Package, Image, Tag, Palette, HardDrive, Clock, CreditCard, FileText, Settings } from 'lucide-react';
import axios from 'axios';

interface Specification {
  key: string;
  value: string;
}

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
  specifications: Specification[]; // Changed to array of objects
  productImages: string[];
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
    specifications: [], // Initialize as empty array
    productImages: []
  });

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [specificationKey, setSpecificationKey] = useState<string>('');
  const [specificationValue, setSpecificationValue] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const uploadPromise = new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = async () => {
            try {
              const base64File = reader.result?.toString().split(",")[1];
              if (!base64File) {
                reject(new Error('Failed to read file'));
                return;
              }

              const response = await axios.post('/api/imagekit_auth', {
                file: base64File,
                fileName: file.name
              });

              const data = response.data;
              console.log('Uploaded image URL:', data.url);
              resolve(data.url);
            } catch (error) {
              console.error('Error uploading image:', error);
              reject(error);
            }
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
        });

        const url = await uploadPromise;
        uploadedUrls.push(url);
      }

      setFormData(prev => ({
        ...prev,
        productImages: [...prev.productImages, ...uploadedUrls]
      }));

    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number): void => {
    setFormData(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, index) => index !== indexToRemove)
    }));
  };

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
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addColor = (): void => {
    if (selectedColor.trim() && !formData.colors.includes(selectedColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, selectedColor.trim()]
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
    if (selectedStorage.trim() && !formData.storageOptions.includes(selectedStorage.trim())) {
      setFormData(prev => ({
        ...prev,
        storageOptions: [...prev.storageOptions, selectedStorage.trim()]
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

  // New functions for specifications
  const addSpecification = (): void => {
    if (specificationKey.trim() && specificationValue.trim()) {
      // Check if key already exists
      const existingSpec = formData.specifications.find(spec => 
        spec.key.toLowerCase() === specificationKey.trim().toLowerCase()
      );
      
      if (existingSpec) {
        alert('Specification with this key already exists');
        return;
      }

      const newSpec: Specification = {
        key: specificationKey.trim(),
        value: specificationValue.trim()
      };

      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, newSpec]
      }));
      
      setSpecificationKey('');
      setSpecificationValue('');
    }
  };

  const removeSpecification = (indexToRemove: number): void => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, index) => index !== indexToRemove)
    }));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', newValue: string): void => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: newValue } : spec
      )
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      if (!formData.brand.trim() || !formData.productName.trim() || !formData.price.trim() || !formData.sku.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        alert('Please enter a valid price');
        return;
      }

      const submitData = {
        ...formData,
        price: Number(formData.price),
        colors: formData.colors,
        storageOptions: formData.storageOptions,
        specifications: formData.specifications, // Already an array of objects
        productImages: formData.productImages
      };

      try {
        const response = await axios.post('/api/productlist', submitData);
        console.log('Product added successfully:', response.data);
       if(response.status === 200) {
         alert('Product added successfully!');
       }
      } catch (error) {
        console.error('Error adding product:', error);
      }

      console.log('Submitting form data:', submitData);
     
      
      // setFormData({
      //   brand: '',
      //   productName: '',
      //   price: '',
      //   availability: 'In Stock',
      //   sku: '',
      //   colors: [],
      //   storageOptions: [],
      //   accessories: '',
      //   deliveryTime: '',
      //   emiAvailable: false,
      //   specifications: [],
      //   productImages: []
      // });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error adding product. Please try again.');
    }
  };

  const handleSaveDraft = (): void => {
    try {
      localStorage.setItem('productDraft', JSON.stringify(formData));
      console.log('Draft saved:', formData);
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft.');
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-green-600 bg-green-50 border-green-200';
      case 'Out of Stock': return 'text-red-600 bg-red-50 border-red-200';
      case 'Pre-Order': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600">Create a new product listing with detailed information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="e.g., Apple"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      placeholder="e.g., iPhone 12 Pro (Apple Refurbished)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Price (৳) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500 font-medium">৳</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="60000"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${getAvailabilityColor(formData.availability)}`}
                    >
                      <option value="In Stock">✅ In Stock</option>
                      <option value="Out of Stock">❌ Out of Stock</option>
                      <option value="Pre-Order">⏳ Pre-Order</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      SKU Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="SKU-001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span>Delivery Time</span>
                    </label>
                    <input
                      type="text"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      placeholder="3-5 Days"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Colors Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Available Colors</h2>
                </div>
                
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedColor(e.target.value)}
                    placeholder="Enter color name"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    onKeyDown={(e) => e.key === 'Enter' && addColor()}
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                
                {formData.colors.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {formData.colors.map((color: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 shadow-sm"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors"
                          aria-label={`Remove ${color}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Storage Options Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <HardDrive className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Storage Options</h2>
                </div>
                
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={selectedStorage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedStorage(e.target.value)}
                    placeholder="Enter storage option (e.g., 128GB)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    onKeyDown={(e) => e.key === 'Enter' && addStorage()}
                  />
                  <button
                    type="button"
                    onClick={addStorage}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                
                {formData.storageOptions.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {formData.storageOptions.map((storage: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-blue-100 to-green-100 text-gray-700 border border-gray-300 shadow-sm"
                      >
                        {storage}
                        <button
                          type="button"
                          onClick={() => removeStorage(storage)}
                          className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors"
                          aria-label={`Remove ${storage}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications Section - NEW ARRAY OBJECT STRUCTURE */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Product Specifications</h2>
                </div>
                
                {/* Add new specification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={specificationKey}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecificationKey(e.target.value)}
                    placeholder="Enter specification name (e.g., Processor)"
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={specificationValue}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecificationValue(e.target.value)}
                      placeholder="Enter specification value (e.g., A14 Bionic chip)"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      onKeyDown={(e) => e.key === 'Enter' && addSpecification()}
                    />
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                
                {/* Display specifications */}
                {formData.specifications.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Added Specifications:</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {formData.specifications.map((spec: Specification, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
                        >
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={spec.key}
                              onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                              placeholder="Specification name"
                            />
                            <input
                              type="text"
                              value={spec.value}
                              onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Specification value"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSpecification(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-2 transition-colors flex-shrink-0"
                            aria-label={`Remove ${spec.key} specification`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Accessories Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Additional Details</h2>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Included Accessories
                  </label>
                  <textarea
                    name="accessories"
                    value={formData.accessories}
                    onChange={handleInputChange}
                    placeholder="Apple USB-C to Lightning Cable (1m), Documentation"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">EMI Available</h3>
                      <p className="text-xs text-gray-600">Enable installment payments</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emiAvailable"
                      checked={formData.emiAvailable}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>

              {/* Product Images */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Image className="w-4 h-4 text-pink-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Product Images</h2>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <span className="text-sm font-medium text-orange-600 hover:text-orange-500">
                          {uploading ? 'Uploading...' : 'Click to upload images'}
                        </span>
                        <span className="text-sm text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </label>
                </div>

                {formData.productImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.productImages.map((url: string, index: number) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="flex-1 bg-orange-500 text-white py-4 px-8 rounded-xl hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <Package className="w-5 h-5" />
                  <span>{uploading ? 'Please wait...' : 'Add Product'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 px-8 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border border-gray-300 hover:border-gray-400 flex items-center justify-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Save as Draft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;