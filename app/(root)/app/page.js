"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReportAnalyzer from "@/components/app-page/ReportAnalyzer";
import ReportViewer from "@/components/app-page/ReportViewer";
import useReportStore from "@/store/useReportStore";

const Page = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { reports, fetchReports, deleteReport } = useReportStore();

  const getReports = async () => {
    await fetchReports()
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Redirect to home if user is not logged in
    } else {
      setIsAuthenticated(true);
    }
    
    getReports();
    
  }, [router]);

  if (!isAuthenticated) {
    return null; // Prevent rendering until authentication check is done
  }

  return (
    <div  className="relative py-12 px-6 sm:px-12 lg:px-24 overflow-hidden">
      <section className="relative text-center flex flex-col md:items-center mb-8">
                <div className="relative inline-block w-fit px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-3">
                    AI-Powered Medical Analysis
                </div>
                <h1 className="text-3xl text-left md:text-center font-semibold text-gray-800 tracking-wide">
                    Smarter Health Insights, Instantly
                </h1>
                <p className="mt-2 text-left md:text-center text-gray-600 md:max-w-2xl">
                    Upload your medical reports and let AI analyze them for insights, potential concerns, and expert recommendations.
                </p>
            </section>
      
      <div className="border p-6 rounded-3xl">
      <ReportAnalyzer />
      </div>
      <div className="mt-2">
      <ReportViewer 
        reports={reports} 
        onDelete={deleteReport}
      />
      </div>
    </div>
  );
};

export default Page;