"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    division: "",
    district: "",
    upazila: "",
    postCode: "",
    address: "",
    paymentMethod: "cash_on_delivery",
    deliveryMethod: "courier_service"
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bangladesh divisions
  const bangladeshDivisions = [
    "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"
  ];

  // Sample districts by division
  const districtsByDivision: { [key: string]: string[] } = {
    "Dhaka": ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Kishoreganj", "Manikganj", "Munshiganj", "Narsingdi", "Rajbari", "Shariatpur", "Faridpur", "Gopalganj", "Madaripur"],
    "Chittagong": ["Chittagong", "Cox's Bazar", "Rangamati", "Bandarban", "Khagrachhari", "Feni", "Lakshmipur", "Comilla", "Noakhali", "Brahmanbaria", "Chandpur"],
    "Rajshahi": ["Rajshahi", "Bogura", "Pabna", "Sirajganj", "Natore", "Joypurhat", "Chapainawabganj", "Naogaon"],
    // Add more divisions and their districts as needed
  };

  // Sample upazilas by district
  const upazilasByDistrict: { [key: string]: string[] } = {
    "Dhaka": ["Dhanmondi", "Gulshan", "Banani", "Uttara", "Mirpur", "Tejgaon", "Ramna", "Wari", "Kotwali", "Lalbagh", "Hazaribagh", "New Market", "Shahbagh", "Paltan", "Motijheel"],
    "Chittagong": ["Kotwali", "Panchlaish", "Double Mooring", "Halishahar", "Chandgaon", "Bakalia", "Bayazid", "Pahartali", "Carbazar", "Bandar", "Karnaphuli", "Boalkhali", "Anowara", "Chandanaish", "Satkania", "Lohagara", "Banshkhali", "Sandwip", "Sitakunda", "Mirsharai", "Fatikchhari", "Rangunia", "Raozan", "Patiya", "Hathazari"],
    // Add more districts and their upazilas as needed
  };

  useEffect(() => {
    if (productId) {
      fetch(`/api/getproduct/checkout?productId=${productId}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error(err));
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields when parent changes
      ...(name === 'division' && { district: '', upazila: '' }),
      ...(name === 'district' && { upazila: '' })
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.division) newErrors.division = "Division is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.upazila) newErrors.upazila = "Upazila is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const orderData = {
        ...formData,
        productId,
        product,
        orderDate: new Date().toISOString(),
        totalAmount: product.price
      };

      console.log("Order submitted:", orderData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Order placed successfully! We will contact you soon.");
      
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!productId) return <div className="container mx-auto p-4">No product selected</div>;
  if (!product) return <div className="container mx-auto p-4">Loading product...</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <p><strong>Product:</strong> {product.productName}</p>
          <p><strong>Price:</strong> ৳ {product.price}</p>
          <hr className="my-3" />
          <p className="text-lg font-bold">Total: ৳ {product.price}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Delivery Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* District */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white ${
                    errors.district ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Select your city</option>
                  {formData.division && districtsByDivision[formData.division]?.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
              </div>

              {/* Post Code */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Post Code
                </label>
                <input
                  type="text"
                  name="postCode"
                  value={formData.postCode}
                  onChange={handleInputChange}
                  placeholder="Enter Post Code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Division */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Division <span className="text-red-500">*</span>
                </label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white ${
                    errors.division ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Select your division</option>
                  {bangladeshDivisions.map((division) => (
                    <option key={division} value={division}>{division}</option>
                  ))}
                </select>
                {errors.division && <p className="text-red-500 text-sm mt-1">{errors.division}</p>}
              </div>

              {/* Upazila */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Upazila <span className="text-red-500">*</span>
                </label>
                <select
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white ${
                    errors.upazila ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  disabled={!formData.district}
                >
                  <option value="">Select your area</option>
                  {formData.district && upazilasByDistrict[formData.district]?.map((upazila) => (
                    <option key={upazila} value={upazila}>{upazila}</option>
                  ))}
                </select>
                {errors.upazila && <p className="text-red-500 text-sm mt-1">{errors.upazila}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="For ex: House: 23, Road: 24, Block: B"
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.paymentMethod === 'online_payment'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'online_payment' }))}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Online Payment</span>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.paymentMethod === 'cash_on_delivery'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash_on_delivery' }))}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.9 1 3 1.9 3 3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9M19 9H15V5L19 9Z"/>
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Method */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Delivery Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.deliveryMethod === 'courier_service'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'courier_service' }))}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5M19.5,9.5L21.46,12H17V9.5M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8Z"/>
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Courier Service</span>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.deliveryMethod === 'shop_pickup'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'shop_pickup' }))}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Shop Pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-orange-500'
          } transition-colors`}
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}