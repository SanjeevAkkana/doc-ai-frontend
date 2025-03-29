"use client";
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import useReportStore from "@/store/useReportStore";
import {
  Upload,
  ScanText,
  Sparkles,
  Save,
  Loader2,
  X,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

const ReportAnalyzer = () => {
  const { createReport } = useReportStore();
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [reportName, setReportName] = useState("");
  const [nameError, setNameError] = useState("");

  // Handle File Upload - Images only
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.match(/image\/(jpeg|png|jpg)/)) {
      alert("Please upload a JPG or PNG image file");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    extractText(selectedFile);
  };

  // Extract Text from Image
  const extractText = async (imageFile) => {
    setExtracting(true);
    try {
      const { data } = await Tesseract.recognize(imageFile, "eng");
      setExtractedText(data.text);
    } catch (error) {
      console.error("Extraction error:", error);
      alert("Failed to extract text. Please try a clearer image.");
    } finally {
      setExtracting(false);
    }
  };

  // Validate form inputs
  const validateForm = () => {
    if (!reportName || reportName.trim().length < 3) {
      setNameError("Report name must be at least 3 characters");
      return false;
    }
    
    if (!extractedText) {
      alert("Please upload and extract text first");
      return false;
    }
    
    setNameError("");
    return true;
  };

  // Analyze Text using Gemini API
  const analyzeWithGemini = async (content) => {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const prompt = `Analyze this medical report and return JSON with:
      - problem: string
      - solution: string
      - precautions: string
      - suggestions: string[]
      - tips: string[]
      - uses: string (optional)
      - dosage: string (optional)
      - sideEffects: string (optional)
      - route: string (optional)
      - disclaimer: string
      
      Content: ${content}`;

      const result = await model.generateContent(prompt);
      const textResponse = result.response.text();
      
      // Extract JSON from response
      const jsonStart = textResponse.indexOf("{");
      const jsonEnd = textResponse.lastIndexOf("}") + 1;
      return JSON.parse(textResponse.slice(jsonStart, jsonEnd));
    } catch (error) {
      console.error("Analysis error:", error);
      throw new Error("Failed to analyze report");
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setAnalyzing(true);
    try {
      const analysis = await analyzeWithGemini(extractedText);
      setAnalysis(analysis);
    } catch (error) {
      alert(error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!analysis) {
      alert("No analysis to save");
      return;
    }

    try {
      await createReport(reportName, extractedText, analysis);
      alert("Report saved successfully!");
      resetForm();
    } catch (error) {
      alert("Failed to save report");
    }
  };

  const resetForm = () => {
    setFile(null);
    setExtractedText("");
    setAnalysis(null);
    setPreviewUrl(null);
    setReportName("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };

  return (
    <div className="">
      <div className="flex items-center gap-x-2 mb-6">
        <h1 className="text-xl font-semibold">Report Analyzer</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <label className="cursor-pointer">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="w-8 h-8 text-gray-500" />
                <p className="font-medium">Upload Medical Report</p>
                <p className="text-sm text-gray-500">JPG or PNG (Max 10MB)</p>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {previewUrl && (
            <div className="border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Preview
                </h3>
                <button onClick={resetForm} className="text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <img
                src={previewUrl}
                alt="Uploaded report"
                className="max-h-60 object-contain mx-auto"
              />
              <div className="mt-3 text-xs text-gray-500">
                {file.name} ({Math.round(file.size / 1024)} KB)
              </div>
            </div>
          )}
        </div>

        {/* Analysis Section */}
        <div className="space-y-4">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Report Name</label>
              <input
                type="text"
                placeholder="Patient Health Report"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="w-full p-3 border rounded-xl"
              />
              {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <ScanText className="w-4 h-4" /> Extracted Text
              </label>
              <textarea
                className="w-full p-3 border rounded-xl h-40"
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder={extracting ? "Extracting..." : "Text will appear here"}
                disabled={extracting}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={extracting || analyzing || !extractedText}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-white ${
                  extracting || analyzing || !extractedText
                    ? "bg-gray-400"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {analyzing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {analyzing ? "Analyzing..." : "Analyze"}
              </button>

              {analysis && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save /> Save
                </button>
              )}
            </div>
          </form>

          {analysis && (
            <div className="border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Sparkles /> Analysis Results
                </h3>
                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">
                  <Check className="inline mr-1" /> Verified
                </span>
              </div>

              <div className="space-y-3">
                {Object.entries(analysis).map(([key, value]) => (
                  <div key={key} className="border-b pb-2 last:border-0">
                    <h4 className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </h4>
                    {Array.isArray(value) ? (
                      <ul className="list-disc pl-5 text-sm">
                        {value.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm">{value || "Not specified"}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalyzer;