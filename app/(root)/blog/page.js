'use client';
import { useState } from "react";
import { blogs } from "@/utils/blogData";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ExternalLink, Clock, Calendar } from "lucide-react";

const BlogPage = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="py-12 px-6 sm:px-12 lg:px-24">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6"
      >
        <motion.h1 
          className="text-2xl font-bold tracking-wide bg-clip-text mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          The AI Healthcare Revolution
        </motion.h1>
        <motion.p 
          className="text-gray-600 max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Discover how artificial intelligence is transforming patient care, medical diagnostics, and treatment outcomes.
        </motion.p>
      </motion.section>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative group overflow-hidden bg-white transition-all duration-300"
          >
            <div className="relative h-60 rounded-3xl w-full overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 z-10">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-teal-600 text-white">
                  {blog.category || "AI Health"}
                </span>
              </div>
            </div>

            <div className="py-6 px-2">
              <h3 
                className="text-xl tracking-wide font-semibold text-gray-900 mb-2 cursor-pointer transition-colors"
                onClick={() => setSelectedBlog(blog)}
              >
                {blog.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {blog.content[0].description}
              </p>

              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => setSelectedBlog(blog)}
                className="flex items-center cursor-pointer text-teal-600 font-medium"
              >
                Read article <ArrowRight className="w-4 h-4 ml-1" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Blog Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setSelectedBlog(null)}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 md:h-80 w-full">
                <Image
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 md:p-8">

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {selectedBlog.title}
                </h2>

                <div className="prose max-w-none">
                  {selectedBlog.content.map((section, idx) => (
                    <div key={idx} className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {section.heading}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPage;