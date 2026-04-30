import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function SearchMembersModal({ isOpen, onClose, onSelectMember }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setError('');
      return;
    }
    if (query.trim() === '') {
      setResults([]);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchMembers(query); 
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [query, isOpen]);

  const searchMembers = async (q) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/member/search?q=${encodeURIComponent(q)}`, { withCredentials: true });
      setResults(res.data.members || []);
      setLoading(false);
    } catch (err) {
      setError('Error searching members');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1002] p-4">
      <div className="bg-white rounded-[10px] w-[90%] max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#ddd] flex justify-between items-center shrink-0">
          <h2 className="text-[1.5rem] font-bold text-gray-900 text-left">Search Members</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer transition"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <div className="p-6 border-b border-[#ddd] bg-gray-50 shrink-0">
          <input
            type="text"
            className="w-full p-[0.8rem] border border-[#ddd] rounded-[5px] focus:outline-none focus:border-gray-500"
            placeholder="Search by name, roll no, or any field..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1" style={{ minHeight: '30vh' }}>
          {query.trim() === '' ? (
            <div className="text-center text-gray-400 py-8 text-lg select-none">
              🔍 <span className="font-semibold">Enter something to search for members!</span>
              <div className="text-sm text-gray-300 mt-1">Try typing a name, roll number, or phone number.</div>
            </div>
          ) : loading ? (
            <div className="text-center text-gray-500 py-4 animate-pulse">Searching...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : results.length === 0 ? (
            <div className="text-center text-gray-400 py-4">No members found.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {results.map(member => (
                <li
                  key={member._id}
                  className="py-3 px-2 hover:bg-gray-100 cursor-pointer rounded transition flex flex-col gap-1"
                  onClick={() => onSelectMember && onSelectMember(member)}
                >
                  <span className="font-semibold text-gray-900">
                    {member.name} <span className="text-gray-500">({member.roll_no})</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    Plan: {member.subscriptions[0]?.plan || 'N/A'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-6 border-t border-[#ddd] flex justify-end gap-4 shrink-0">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-[#eee] text-black rounded-[5px] font-bold cursor-pointer transition hover:bg-gray-200"
          >
            Close
          </button>
        </div>
        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #e5e7eb;
              border-radius: 4px;
            }
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #e5e7eb #fff;
            }
          `}
        </style>
      </div>
    </div>
  );
} 