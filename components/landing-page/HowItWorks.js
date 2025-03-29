import { FileUp, Edit, BrainCircuit, ClipboardCheck, MessageSquareHeart } from "lucide-react";

const steps = [
    {
        icon: <FileUp className="w-5 h-5 text-teal-600" />, 
        title: "Upload Your Report", 
        description: "Easily upload your medical report in PDF or image format."
    },
    {
        icon: <Edit className="w-5 h-5 text-teal-600" />, 
        title: "Edit If Needed", 
        description: "Modify extracted text or correct any errors before analysis."
    },
    {
        icon: <BrainCircuit className="w-5 h-5 text-teal-600" />, 
        title: "AI Analysis", 
        description: "AI extracts insights and identifies key health-related information."
    },
    {
        icon: <ClipboardCheck className="w-5 h-5 text-teal-600" />, 
        title: "Get Your Report", 
        description: "Receive a structured, easy-to-understand medical summary."
    },
    {
        icon: <MessageSquareHeart className="w-5 h-5 text-teal-600" />, 
        title: "Chat with AI", 
        description: "Ask follow-up questions and get AI-powered health guidance."
    }
];

function HowItWorks() {
    return (
        <section className="relative py-16 px-6 sm:px-12 lg:px-24 overflow-hidden">
            {/* Background Floating Elements */}
            {/* <div className="absolute w-32 h-32 bg-amber-500 opacity-30 top-10 left-10 rounded-full blur-3xl"></div>
            <div className="absolute w-32 h-32 bg-teal-500 opacity-20 top-1/3 right-10 rounded-full blur-3xl"></div>
            <div className="absolute w-32 h-32 bg-red-500 opacity-25 bottom-10 left-1/4 rounded-full blur-3xl"></div> */}

            {/* Section Title */}
            <div className="text-center mb-10">
                <h2 className="text-3xl text-left md:text-center font-semibold text-gray-800 tracking-wide">
                    How It Works
                </h2>
                <p className="mt-2 text-left md:text-center text-gray-600">
                    A seamless process for AI-powered medical report analysis.
                </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {steps.map((step, index) => (
                    <div key={index} className="p-5 border rounded-3xl bg-white flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl duration-300 cursor-pointer">
                        {/* Step Icon */}
                        <div className="p-2 w-fit bg-teal-100 rounded-full flex items-center justify-center">
                            {step.icon}
                        </div>

                        {/* Step Title */}
                        <h3 className="font-semibold text-gray-900 mt-4">{step.title}</h3>

                        {/* Step Description */}
                        <p className="text-gray-600 font-light text-sm mt-2 leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HowItWorks;