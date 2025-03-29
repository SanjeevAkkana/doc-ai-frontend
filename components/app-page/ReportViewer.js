'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  FileText, 
  Trash2,
  Edit3,
  Download,
  Calendar,
  Clock
} from 'lucide-react';

const ReportViewer = ({ reports, onDelete }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Helper function to safely render analysis content
  const renderAnalysisValue = (value) => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {value.map((item, i) => (
            <li key={i} className="text-gray-600">
              {typeof item === 'object' ? JSON.stringify(item) : item}
            </li>
          ))}
        </ul>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey}>
              <span className="font-medium">{subKey}:</span>{' '}
              {renderAnalysisValue(subValue)}
            </div>
          ))}
        </div>
      );
    }
    
    return <p className="text-gray-600">{value || 'Not specified'}</p>;
  };

  return (
    <div className="py-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:text-center"
      >
        <h1 className="text-3xl font-semibold tracking-wide bg-clip-text mb-3">
          Medical Report Archive
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Review and manage your analyzed medical reports with AI-powered insights
        </p>
      </motion.header>

      {/* Report Cards Grid */}
      {reports && reports.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {reports.map((report, index) => (
      <motion.div
        key={report._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
        className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all"
      >
        {/* Card Image/Placeholder */}
        <div className="h-48 bg-gradient-to-br from-teal-50 to-blue-50 relative flex items-center justify-center">
          <FileText className="w-16 h-16 text-teal-400" />
          {hoveredCard === index && (
            <motion.div 
              className="absolute inset-0 bg-black/10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button 
                onClick={() => setSelectedReport(report)}
                className="px-4 py-2 bg-white rounded-full flex items-center text-sm font-medium"
              >
                View Report <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
              {report.name}
            </h3>
            <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">
              {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {report.content.substring(0, 100)}...
          </p>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <span>
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setSelectedReport(report)}
                className="p-2 text-gray-500 hover:text-teal-600 transition-colors"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete(report._id)}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
) : (
  <div className="text-center p-12 rounded-2xl border text-gray-500">
    No reports available
  </div>
)}

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 p-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedReport.name}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      Created: {new Date(selectedReport.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  className="p-2 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedReport(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Original Content
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedReport.content}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    AI Analysis
                  </h3>
                  <div className="space-y-6">
                    {Object.entries(selectedReport.analysis).map(([key, value]) => (
                      <div key={key} className="border-b pb-4 last:border-0">
                        <h4 className="font-medium text-gray-700 capitalize mb-2">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </h4>
                        {renderAnalysisValue(value)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button 
                    onClick={() => {
                      onDelete(selectedReport._id);
                      setSelectedReport(null);
                    }}
                    className="px-4 py-2 cursor-pointer bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportViewer;