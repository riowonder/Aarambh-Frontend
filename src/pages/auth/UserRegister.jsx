import { NavLink, useNavigate, useLocation, data } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";

export default function UserRegister() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        aadhar: "",
        blood_group: "",
        age: "",
        image: null
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    // Handle input changes
    function handleInputChange(e) {
        const { name, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    }

    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        setLoading(true);
        console.log(formData);
        try {
            // Use FormData for file upload
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key]) {
                    data.append(key, formData[key]);
                }
            });

            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/user-register`, data, { 
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            
            // Store user data in context
            login(response.data.user || {
                name: formData.name,
                email: formData.email,
            });
            
            toast.success("User account created successfully!");
            navigate("/user/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-muted py-10 px-4">
            <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Create User Account</h2>
                    <p className="text-sm text-muted-foreground">Enter your details below to sign up</p>
                </div>
                <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name (Mandatory) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 text-start">Name *</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                                placeholder="Your full name" 
                                required 
                            />
                        </div>
                        {/* Email (Mandatory) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 text-start">Email *</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                                placeholder="you@example.com" 
                                required 
                            />
                        </div>
                        {/* Phone Number (Mandatory) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 text-start">Phone Number *</label>
                            <input 
                                type="tel" 
                                name="phone"
                                pattern="[0-9]{10}"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                                placeholder="10-digit phone number"
                                title="Please enter a valid 10 digit number"
                                required 
                            />
                        </div>
                        {/* Address (Mandatory) */}
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 text-start">Address *</label>
                            <textarea 
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none" 
                                placeholder="Your complete address" 
                                required 
                            ></textarea>
                        </div>
                        {/* Secret KEY */}
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 text-start">Secret Key *</label>
                            <input 
                                name="secret_key"
                                value={formData.secret_key}
                                onChange={handleInputChange}
                                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary h-10 resize-none" 
                                placeholder="Your Secret Key" 
                                required 
                            />
                        </div>
                        {/* Date of Birth (Optional) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 text-start">Date of Birth</label>
                            <input 
                                type="date" 
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                            />
                        </div>
                        {/* Age (Optional) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 text-start">Age</label>
                            <input 
                                type="number" 
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                min="1"
                                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                                placeholder="E.g. 25" 
                            />
                        </div>
                        {/* Aadhar Card Number (Optional) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 text-start">Aadhar Number</label>
                            <input 
                                type="text" 
                                name="aadhar"
                                pattern="[0-9]{12}"
                                value={formData.aadhar}
                                onChange={handleInputChange}
                                title="Please enter a valid 12 digit Aadhar number"
                                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                                placeholder="12-digit Aadhar number" 
                            />
                        </div>
                        {/* Blood Group (Optional) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 text-start">Blood Group</label>
                            <select 
                                name="blood_group"
                                value={formData.blood_group}
                                onChange={handleInputChange}
                                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                        {/* Image (Optional) */}
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 text-start">Profile Image</label>
                            <input 
                                type="file" 
                                name="image"
                                accept="image/*"
                                onChange={handleInputChange}
                                className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary w-full" 
                            />
                            {formData.image && (
                                <p className="text-sm text-gray-500">Selected: {formData.image.name}</p>
                            )}
                        </div>
                        
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition flex items-center justify-center cursor-pointer mt-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>    
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>
                <div className="flex flex-col gap-2 mt-4 border-t pt-4 border-gray-100">
                    <p className="text-sm text-center text-gray-500">
                        Already have an account? <NavLink to="/user-login" className="underline hover:text-black">Login in user</NavLink>
                    </p>
                    {/* <p className="text-sm text-center text-gray-500">
                        <NavLink to="/dashlogin" className="underline text-cyan-700 hover:text-cyan-900 font-medium">Login as admin</NavLink>
                    </p> */}
                </div>
            </div>
        </div>
    );
}
