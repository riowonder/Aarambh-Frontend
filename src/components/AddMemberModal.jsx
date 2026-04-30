import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const plans = [
  '1 Month',
  '3 Months',
  '6 Months',
  '1 Year',
  'Custom'
];

export default function AddMemberModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    roll_no: '',
    name: '',
    phone_number: '',
    subscription_plan: 'Custom',
    extra_days: '',
    amount: '',
    start_date: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    address: ''
  });
  const [memberImage, setMemberImage] = useState(null); // New state for image
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_number") {
      // Only allow numbers, max 10 digits
      const cleaned = value.replace(/[^\d]/g, "").slice(0, 10);
      setForm(prev => ({
        ...prev,
        [name]: cleaned
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) { // 3MB in bytes
        setImageError('Image should be less than 3 MB');
        setMemberImage(null);
        console.log('imageError set:', 'Image should be less than 3 MB');
        console.log('memberImage set to:', null);
      } else {
        setImageError('');
        setMemberImage(file);
        console.log('imageError cleared');
        console.log('memberImage set to:', file);
      }
    } else {
      setImageError('');
      setMemberImage(null);
      console.log('imageError cleared');
      console.log('memberImage set to:', null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (imageError) {
      return;
    }
    setLoading(true);

    try {
      // Create FormData for member details and image
      const memberFormData = new FormData();
      memberFormData.append('roll_no', form.roll_no);
      memberFormData.append('name', form.name);
      memberFormData.append('phone_number', form.phone_number);
      memberFormData.append('height', form.height);
      memberFormData.append('weight', form.weight);
      memberFormData.append('age', form.age);
      memberFormData.append('gender', form.gender);
      memberFormData.append('address', form.address);
      memberFormData.append('dob', form.dob);
      if (memberImage) {
        memberFormData.append('image', memberImage); // Append the image file
      }

      // First, create the member
      const memberResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/member/add`,
        memberFormData, // Send FormData
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
          },
        }
      );

      if (memberResponse.data.success) {
        const member = memberResponse.data.member;

        // Then, add the subscription for the newly created member
        if (form.start_date && form.subscription_plan) {
          try {
            const subscriptionResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/member/${member._id}/subscription`, {
              plan: form.subscription_plan,
              amount: Number(form.amount) || 0,
              extra_days: form.extra_days ? Number(form.extra_days) : 0,
              start_date: form.start_date,
              status: 'Active'
            }, { withCredentials: true });

            if (subscriptionResponse.data.success) {
              toast.success("Member and subscription added successfully!");
            } else {
              toast.success("Member added successfully, but subscription failed!");
            }
          } catch (subscriptionError) {
            toast.success("Member added successfully, but subscription failed!");
            console.error("Subscription error:", subscriptionError);
          }
        } else {
          toast.success("Member added successfully!");
        }

        onSuccess();
        onClose();
        // Reset form
        setForm({
          roll_no: '',
          name: '',
          phone_number: '',
          subscription_plan: 'Custom',
          extra_days: '',
          amount: '',
          start_date: '',
          height: '',
          weight: '',
          age: '',
          gender: '',
          address: ''
        });
        setMemberImage(null); // Reset image state
        setImageError('');
      }
    } catch (error) {
      console.log("Error in add member : ",error);
      setError(error.response?.data?.message || `Failed to add member : ${error}`); // More detailed error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1002] p-4">
      <div className="bg-white rounded-[10px] w-[90%] max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#ddd] flex justify-between items-center shrink-0">
          <h2 className="text-[1.5rem] font-bold text-gray-900 text-left">Add New Member</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="p-6 overflow-y-auto hide-scrollbar">
            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">Serial No.:</label>
              <input
                type="text"
                name="roll_no"
                value={form.roll_no}
                onChange={handleChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                placeholder="Enter Serial No."
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">Name:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                placeholder="Enter Member Name"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">Phone Number:</label>
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                placeholder="Enter Phone Number"
                pattern="\d{10}"
                maxLength={10}
                title="Please enter a valid 10-digit phone number"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                placeholder="Enter Date of Birth"
              />
            </div>

            {/* New Personal Details Section */}
            <div className="border-t border-[#ddd] pt-4 mt-2">
              <h3 className="block mb-4 font-bold text-gray-900 text-[1.2rem] text-left">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-6">
                  <label className="block mb-2 font-bold text-gray-800 text-left">Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                    placeholder="Age"
                    min="1"
                    max="120"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-bold text-gray-800 text-left">Gender:</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-bold text-gray-800 text-left">Height (cm):</label>
                  <input
                    type="number"
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                    placeholder="Height in cm"
                    min="50"
                    max="300"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-bold text-gray-800 text-left">Weight (kg):</label>
                  <input
                    type="number"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                    placeholder="Weight in kg"
                    min="10"
                    max="500"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-bold text-gray-800 text-left">Address:</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                  placeholder="Enter address"
                  rows="3"
                />
              </div>
              {/* Image Upload Input */}
              <div className="mb-6">
                <label className="block mb-2 font-bold text-gray-800 text-left">Member Image:</label>
                <input
                  type="file"
                  name="member_image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500 bg-white"
                />
                {imageError && (
                  <div className="text-red-600 text-sm mt-1">{imageError}</div>
                )}
              </div>
            </div>

            {/* Subscription Details Section */}
            <div className="border-t border-[#ddd] pt-4 mt-2">
              <h3 className="block mb-4 font-bold text-gray-900 text-[1.2rem] text-left">Subscription Details</h3>
              <div className="mb-6">
                <label className="block mb-2 font-bold text-gray-800 text-left">Subscription Plan | Extra Days</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    name="subscription_plan"
                    value={form.subscription_plan || 'Custom'}
                    onChange={handleChange}
                    className="flex-1 p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                  >
                    {plans.map((plan) => (
                      <option key={plan} value={plan}>{plan}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="extra_days"
                    value={form.extra_days}
                    onChange={handleChange}
                    className="w-full sm:w-1/3 p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                    placeholder="Extra Days"
                    min="0"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-bold text-gray-800 text-left">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                  placeholder="Enter Amount"
                  min="0"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-bold text-gray-800 text-left">Start Date (required)</label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                  placeholder="dd-mm-yyyy"
                  required
                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
          </div>

          <div className="p-6 border-t border-[#ddd] flex justify-end gap-4 shrink-0">
            <button
              type="submit"
              className={`py-2 px-6 bg-black text-white rounded-[5px] font-bold transition ${loading || !!imageError ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'hover:bg-gray-800 cursor-pointer'}`}
              disabled={loading || !!imageError}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              className="py-2 px-6 bg-[#eee] text-black rounded-[5px] font-bold hover:bg-gray-200 transition cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
