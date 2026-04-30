import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUser } from '../context/UserContext';

const ChangeGymNameModal = ({ isOpen, onClose, currentGymName }) => {
  const [gymName, setGymName] = useState(currentGymName || '');
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gymName.trim()) {
      toast.error('Gym name cannot be empty');
      return;
    }

    if (gymName.trim() === currentGymName) {
      toast.error('New gym name must be different from current name');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/admin/update-gym-name`,
        { gym_name: gymName.trim() },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Gym name updated successfully!');
        // Update the user context with new gym name
        if (updateUser) {
          updateUser({ ...user, gym_name: gymName.trim() });
        }
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to update gym name');
      }
    } catch (error) {
      console.error('Error updating gym name:', error);
      toast.error(error.response?.data?.message || 'Failed to update gym name');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setGymName(currentGymName || '');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1002] p-4" onClick={handleClose}>
      <div className="bg-white rounded-[10px] w-[90%] max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#ddd] flex justify-between items-center shrink-0">
          <h2 className="text-[1.5rem] font-bold text-gray-900 text-left">Change Gym Name</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer disabled:opacity-50"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="p-6 overflow-y-auto">
            <div className="mb-6">
              <label htmlFor="gymName" className="block mb-2 font-bold text-gray-800 text-left">
                Current Gym Name
              </label>
              <input
                type="text"
                value={currentGymName || 'No gym name set'}
                disabled
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] bg-gray-50 text-gray-500 focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="newGymName" className="block mb-2 font-bold text-gray-800 text-left">
                New Gym Name
              </label>
              <input
                type="text"
                id="newGymName"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                placeholder="Enter new gym name"
                disabled={loading}
                className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500"
                maxLength={50}
              />
            </div>
          </div>

          <div className="p-6 border-t border-[#ddd] flex justify-end gap-4 shrink-0">
            <button
              type="submit"
              disabled={loading || !gymName.trim() || gymName.trim() === currentGymName}
              className="py-2 px-6 bg-black text-white rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Gym Name'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="py-2 px-6 bg-[#eee] text-black rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeGymNameModal; 