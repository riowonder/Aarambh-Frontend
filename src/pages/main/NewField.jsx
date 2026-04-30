import React, { useState } from 'react';
import axios from 'axios';

const NewFieldModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fieldName: '',
    fieldType: 'String'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/add-field`,
        {
          fieldName: formData.fieldName,
          fieldType: formData.fieldType
        },
        { withCredentials: true }
      );
      setFormData({ fieldName: '', fieldType: 'String' });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
        console.log(err);
      setError(err.response?.data?.message || 'Failed to add field');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1002] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[10px] w-[90%] max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#ddd] flex justify-between items-center shrink-0">
          <h2 className="text-[1.5rem] font-bold text-gray-900 text-left">Add New Field</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 overflow-y-auto">
            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">
                New Field Name
              </label>
              <input
                type="text"
                name="fieldName"
                value={formData.fieldName}
                onChange={handleInputChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
                placeholder="Enter field name"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-800 text-left">
                New Field Type
              </label>
              <select
                name="fieldType"
                value={formData.fieldType}
                onChange={handleInputChange}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
              >
                <option value="String">Text</option>
                <option value="Number">Number</option>
                <option value="Date">Date</option>
                <option value="Boolean">Boolean</option>
              </select>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}
          </div>

          <div className="p-6 border-t border-[#ddd] flex justify-end gap-4 shrink-0">
            <button
              type="submit"
              className="py-2 px-6 bg-black text-white rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-6 bg-[#eee] text-black rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFieldModal;
