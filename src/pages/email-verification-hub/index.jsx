import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavigation from "../../components/ui/MainNavigation";
import ProcessingStatusBar from "../../components/ui/ProcessingStatusBar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import n8nService from "../../utils/n8nService";

import MethodTabs from "./components/MethodTabs";
import SingleEmailForm from "./components/SingleEmailForm";
import BulkPasteForm from "./components/BulkPasteForm";
import FileUploadForm from "./components/FileUploadForm";
import ProcessingModal from "./components/ProcessingModal";

const EmailVerificationHub = () => {
  const navigate = useNavigate();
  const [activeMethod, setActiveMethod] = useState("single");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingState, setProcessingState] = useState(null);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [error, setError] = useState(null);

  const handleVerification = async (emails) => {
    setIsProcessing(true);
    setShowProcessingModal(true);
    setError(null);

    try {
      const emailList = Array.isArray(emails) ? emails : [emails];
      let response;

      if (activeMethod === "single") {
        response = await n8nService.verifySingleEmail(emailList[0]);
      } else if (activeMethod === "bulk") {
        response = await n8nService.verifyBulkEmails(emailList);
      } else if (activeMethod === "upload") {
        response = await n8nService.verifyFile(emails);
      }

      const results = response?.data?.[0]?.json || response?.data || response;

      setTimeout(() => {
        setIsProcessing(false);
        setShowProcessingModal(false);
        setProcessingState(null);

        navigate("/results-dashboard", {
          state: {
            verificationResults: results?.summary,
            detailedResults: results?.results,
            warning: results?.warning,
            timestamp: new Date()?.toISOString(),
          },
        });
      }, 800);
    } catch (error) {
      console.error("Email verification failed:", error);
      setError(error?.message || "Verification failed. Please try again.");
      setIsProcessing(false);
      setShowProcessingModal(false);
      setProcessingState(null);

      setTimeout(() => setError(null), 5000);
    }
  };

  const handleCancelProcessing = () => {
    setIsProcessing(false);
    setShowProcessingModal(false);
    setProcessingState(null);
    setError(null);
  };

  const handleNewVerification = () => {
    setActiveMethod("single");
    setProcessingState(null);
    setError(null);
  };

  const renderActiveForm = () => {
    switch (activeMethod) {
      case "single":
        return <SingleEmailForm onVerify={handleVerification} isProcessing={isProcessing} />;
      case "bulk":
        return <BulkPasteForm onVerify={handleVerification} isProcessing={isProcessing} />;
      case "upload":
        return <FileUploadForm onVerify={handleVerification} isProcessing={isProcessing} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 font-sans text-gray-100">
  <MainNavigation processingState={processingState} exportInProgress={false} />

  <ProcessingStatusBar
    isVisible={isProcessing && !showProcessingModal}
    progress={processingState?.progress || 0}
    message={processingState?.message}
    estimatedTime={processingState?.estimatedTime}
    processedCount={processingState?.processedCount || 0}
    totalCount={processingState?.totalCount || 0}
    onCancel={handleCancelProcessing}
  />

  {error && (
    <div className="bg-red-800 border-l-4 border-red-500 text-red-300 px-4 py-3 mx-4 mb-4 rounded-r shadow-md animate-fade-in">
      <div className="flex items-center">
        <Icon name="AlertCircle" size={20} className="mr-3 flex-shrink-0" />
        <div>
          <p className="font-semibold">Verification Error</p>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      </div>
    </div>
  )}

  <div className="container mx-auto px-4 lg:px-6 py-8">
    {/* Header */}
    <div className="text-center mb-12">
      <div className="inline-flex items-center space-x-2 px-5 py-2 bg-blue-800 text-cyan-300 rounded-full text-sm font-medium mb-4 shadow-sm">
        <Icon name="Zap" size={16} />
        <span>Jedi Tech Email Verification</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-100 mb-4 animate-fade-in">
        Email Verification Hub
      </h1>

      <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
        Instantly verify emails with advanced validation via n8n workflow. Support for single, bulk, and file uploads.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant="outline"
          onClick={handleNewVerification}
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          New Verification
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/results-dashboard")}
          iconName="BarChart3"
          iconPosition="left"
          iconSize={16}
        >
          View Results
        </Button>
      </div>
    </div>

    {/* Tabs + Forms */}
    <div className="max-w-4xl mx-auto mb-12">
      <MethodTabs activeMethod={activeMethod} onMethodChange={setActiveMethod} />
      <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
        {renderActiveForm()}
      </div>
    </div>

    {/* Features Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {[
        {
          icon: "Shield",
          iconBg: "bg-blue-800/30",
          iconColor: "text-cyan-400",
          title: "Advanced Validation",
          desc: "Multi-layer verification including syntax, domain, and MX record validation via n8n workflow.",
        },
        {
          icon: "Zap",
          iconBg: "bg-green-800/30",
          iconColor: "text-green-400",
          title: "N8N Powered",
          desc: "Connected to powerful n8n automation workflow for real-time email verification.",
        },
        {
          icon: "Download",
          iconBg: "bg-teal-800/30",
          iconColor: "text-teal-400",
          title: "Export Ready",
          desc: "Download verification results in CSV format for easy integration.",
        },
      ].map((card, i) => (
        <div
          key={i}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <div className={`w-14 h-14 ${card.iconBg} rounded-lg flex items-center justify-center mx-auto mb-4`}>
            <Icon name={card.icon} size={24} className={card.iconColor} />
          </div>
          <h3 className="font-semibold text-gray-100 mb-2">{card.title}</h3>
          <p className="text-sm text-gray-300">{card.desc}</p>
        </div>
      ))}
    </div>

    {/* Trust Indicators */}
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-lg">
      <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-300">
        {[
          { icon: "Shield", label: "SSL Secured", color: "text-green-400" },
          { icon: "Workflow", label: "N8N Powered", color: "text-cyan-400" },
          { icon: "Clock", label: "Real-time Processing", color: "text-green-400" },
          { icon: "Users", label: "Open Source", color: "text-teal-400" },
        ].map((item, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Icon name={item.icon} size={16} className={item.color} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>

  <ProcessingModal
    isVisible={showProcessingModal}
    progress={processingState?.progress || 0}
    processedCount={processingState?.processedCount || 0}
    totalCount={processingState?.totalCount || 0}
    estimatedTime={processingState?.estimatedTime}
    onCancel={handleCancelProcessing}
  />
   <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 text-center p-4 text-sm">
      © 2025 Jedi Bentillo. All rights reserved.
    </footer>
</div>

  );
};

export default EmailVerificationHub;
