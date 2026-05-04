import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import BirthdayCard from "../../components/cards/BirthdayCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, UserCheck, Award } from 'lucide-react';

const Finance = () => {
  const [financeData, setFinanceData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();


  const periods = [
    { value: 'current_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_year', label: 'Last Year' }
  ];



  useEffect(() => {
    if (user?.email) {
      fetchFinanceData();
      fetchSummary();
    }
  }, [user, selectedPeriod]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/finance/data?period=${selectedPeriod}`,
        { withCredentials: true }
      );
      setFinanceData(response.data.data);
    } catch (error) {
      console.error('Error fetching finance data:', error);
      toast.error('Failed to load finance data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const summaryResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/finance/summary`,
        { withCredentials: true }
      );
      setSummary(summaryResponse.data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // const getPeriodLabel = (period) => {
  //   return periods.find(p => p.value === period)?.label || period;
  // };

  // Check if user has access to finance features
  const hasFinanceAccess = user?.role === 'admin';

  if (!hasFinanceAccess) {
    return (
      <div className="w-full overflow-x-hidden relative z-10 px-5 py-4 sm:p-8">
        <div className="w-full max-w-5xl mx-auto h-[60vh] flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">You don't have permission to access finance features.</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full overflow-x-hidden relative z-10 px-5 py-4 sm:p-8">
        <div className="w-full max-w-5xl mx-auto h-[60vh] flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-medium tracking-wide">Loading finance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden relative z-10 px-6 py-4 sm:p-8">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 relative">
          {/* Header Row with Back, Heading, Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-4 relative z-10">

            {/* Back Button */}
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer z-30 relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            {/* Centered Heading */}
            <div className="w-full sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 z-10 pointer-events-none text-left sm:text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Analytics</h1>
              <p className="text-gray-500 text-sm mt-1 hidden sm:block">Track your gym's revenue and subscription analytics</p>
            </div>

            {/* Time Filter */}
            <div className="flex flex-col gap-1.5 items-start sm:items-end w-full sm:w-auto z-30 relative">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto min-w-[160px] cursor-pointer transition-colors hover:bg-gray-100"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value} className="text-sm">
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {financeData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-300 flex items-center justify-between transition-shadow hover:shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Total Subscriptions</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1 truncate">
                  {financeData.summary.totalRecords}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-300 flex items-center justify-between transition-shadow hover:shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Top Plan</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900 mt-1 truncate">
                  {financeData.highestRevenuePlan?.plan || 'N/A'}
                </p>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {formatCurrency(financeData.highestRevenuePlan?.revenue || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <BirthdayCard />
            </div>


          </div>
        )}

        {/* Chart Section
        {financeData && financeData.chartData.length > 0 && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-300 mb-6 sm:mb-8 overflow-hidden">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
              Revenue by Plan - {getPeriodLabel(selectedPeriod)}
            </h2>
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financeData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="plan"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                    dy={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                    labelStyle={{ color: '#374151', fontWeight: 600, marginBottom: '0.25rem' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar
                    dataKey="revenue"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                    name="Revenue"
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )} */}

        {/* Table Section */}
        {financeData && financeData.tableData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-300">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Transaction Details
              </h2>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full whitespace-nowrap">
                <thead className="border-b border-gray-300 bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {financeData.tableData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{record.memberName}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{record.memberRollNo}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {record.plan}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">{formatCurrency(record.amount)}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(record.date)}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-500 max-w-[200px] truncate" title={record.description}>
                          {record.description || '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Data State */}
        {financeData && financeData.tableData.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-300 p-8 sm:p-12 text-center mt-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <DollarSign className="w-10 h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No transactions found</h3>
            {/* <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto">
              No revenue data available for {getPeriodLabel(selectedPeriod)}.
            </p> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Finance;