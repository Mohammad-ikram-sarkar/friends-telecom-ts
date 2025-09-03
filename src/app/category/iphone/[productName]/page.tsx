"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Star, Truck, Shield, CreditCard } from "lucide-react";
import { Image, ImageKitProvider } from "@imagekit/next";

export default function Page({ params }: { params: { productName: string } }) {
  const { productName } = params; // use params directly
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!urlEndpoint) {
    return <div>Error: ImageKit URL endpoint is not configured.</div>;
  }

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/getproduct/iphonedetaits/product`, {
          params: { name: productName },
        });
        setProduct(res.data);
        if (res.data.colors?.length > 0) setSelectedColor(res.data.colors[0]);
        if (res.data.storageOptions?.length > 0) setSelectedStorage(res.data.storageOptions[0]);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productName]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
      price / 100
    );
  };

  const nextImage = () => {
    if (product?.productImages) {
      setSelectedImageIndex((prev) => (prev === product.productImages.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (product?.productImages) {
      setSelectedImageIndex((prev) => (prev === 0 ? product.productImages.length - 1 : prev - 1));
    }
  };

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600">The requested product could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden">
              <Image
                src={product.productImages[selectedImageIndex]}
                alt={product.productName}
                fill
                className="object-contain"
                transformation={[{ "bg-removal": "true", format: "png", quality: "auto" }]}
                onError={() => handleImageError(selectedImageIndex)}
                loading="lazy"
              />

              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {product.productImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.productImages.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? "border-blue-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={imageError[index] ? "/fallback.png" : image}
                    alt={`${product.productName} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    transformation={[
                      { "bg-removal": "true", format: "png", width: 80, height: 80, quality: "auto" },
                    ]}
                    onError={() => handleImageError(index)}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-blue-600 font-medium">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.productName}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">(4.8) 2,847 reviews</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.availability === "In Stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.availability}
                </span>
                <span className="text-gray-600">SKU: {product.sku}</span>
              </div>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedColor === color
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.storageOptions && product.storageOptions.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Storage</h3>
                <div className="flex flex-wrap gap-3">
                  {product.storageOptions.map((storage: string) => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedStorage === storage
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {storage}GB
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.availability !== "In Stock"}
              >
                Add to Cart
              </button>
              <button
                className="w-full border border-gray-300 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.availability !== "In Stock"}
              >
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">Free Delivery</div>
                  <div className="text-xs text-gray-600">
                    {product.deliveryTime ? `${product.deliveryTime} days` : "3-5 days"}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Warranty</div>
                  <div className="text-xs text-gray-600">{product.warranty || "1 Year"}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-sm">EMI</div>
                  <div className="text-xs text-gray-600">
                    {product.emiAvailable ? "Available" : "Not Available"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {product.specifications && product.specifications.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map((spec: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="font-medium text-gray-900">{spec.key}</span>
                    <span className="text-gray-600 text-right max-w-xs">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {product.description && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        )}
      </div>
    </ImageKitProvider>
  );
}
