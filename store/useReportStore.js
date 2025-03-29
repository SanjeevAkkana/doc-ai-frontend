import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/report-analysis';

const useReportStore = create((set, get) => ({
  reports: [],
  loading: false,
  error: null,

  // Get auth headers
  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  },

  // Fetch all reports
  fetchReports: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_BASE_URL, get().getAuthHeaders());
      set({ reports: response.data.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch reports',
        loading: false 
      });
    }
  },

  // Create new report
  createReport: async (name, content, analysis = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        API_BASE_URL,
        { name, content, analysis },
        get().getAuthHeaders()
      );
      set(state => ({
        reports: [response.data.data, ...state.reports],
        loading: false
      }));
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create report',
        loading: false
      });
      throw error;
    }
  },

  // Delete report
  deleteReport: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, get().getAuthHeaders());
      set(state => ({
        reports: state.reports.filter(report => report._id !== id),
        loading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete report',
        loading: false
      });
      throw error;
    }
  },

  // Clear errors
  clearError: () => set({ error: null })
}));

export default useReportStore;