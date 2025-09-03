"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Image, ImageKitProvider } from "@imagekit/next";
import Link from "next/link";
import { useRouter } from "next/router";

interface Product {
  _id: string;
  productName: string;
  price: number;
  productImages: string[];
}

const slugify = (text: string) =>
  text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

export default function IphoneAll() {
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!urlEndpoint) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined");
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCheckout = (productName: string, image: string, price: number) => {
    console.log("Checkout product:", { productName, image, price });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/getproduct/iphonelist`
        );
        setProducts(res.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading products...</div>;
  }

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {products.map((product) => {
          const originalPrice = product.price + 13500;
          const discount = Math.round(
            ((originalPrice - product.price) / originalPrice) * 100
          );
          const productSlug = slugify(product.productName);

          return (
            <div
              key={product._id} // ✅ key on the outer div
              className="rounded-2xl shadow-md border bg-white overflow-hidden hover:shadow-lg transition flex flex-col relative w-[300px]"
            >
              <Link
                href={`/category/iphone/${productSlug}`}
                className="h-60 overflow-hidden flex items-center justify-center bg-gray-50 py-10 px-10"
              >
                <div className="relative w-full h-60 flex items-center justify-center bg-gray-50">
                  <Image
                    src={product.productImages?.[0] || "/placeholder.png"}
                    alt={product.productName}
                    fill
                    className="object-contain"
                    transformation={[{ aiRemoveBackground: true }]}
                  />
                </div>
              </Link>

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold line-clamp-2">
                  {product.productName}
                </h2>

                <div className="mt-2">
                  <p className="text-xl font-bold text-gray-900">
                    ৳ {product.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm line-through text-gray-400">
                      ৳ {originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {discount}% OFF
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleCheckout(
                        product.productName,
                        product.productImages?.[0],
                        product.price
                      )
                    }
                    className="flex-1 bg-white border border-gray-200 text-gray-900 text-center py-2 px-4 rounded-xl hover:bg-orange-500 hover:text-white active:bg-orange-700 transition-colors duration-200 font-medium"
                  >
                    Shop Now
                  </button>
                  <button
                    className="bg-white border border-gray-200 text-gray-700 p-2 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
                    onClick={() => console.log("Adding to cart:", product._id)}
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ImageKitProvider>
  );
}
