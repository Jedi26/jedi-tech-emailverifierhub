import React, { useState, useCallback, useRef } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import n8nService from "../../../utils/n8nService";
import { useNavigate } from "react-router-dom";

const FileUploadForm = ({ onVerify, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [fileStats, setFileStats] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [".csv", ".txt"];
  const MAX_EMAILS = 10000;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const parseFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target.result;

          // Parse CSV or TXT content
          let emails = [];

          if (file.name.toLowerCase().endsWith(".csv")) {
            // Simple CSV parsing - split by lines and commas
            const lines = text.split("\n");
            lines.forEach((line) => {
              const cells = line.split(",");
              cells.forEach((cell) => {
                const email = cell.trim().replace(/['"]/g, "");
                if (email && email.includes("@")) {
                  emails.push(email.toLowerCase());
                }
              });
            });
          } else {
            // TXT file - split by common delimiters
            emails = text
              .split(/[\n,;|\s]+/)
              .map((email) => email.trim().toLowerCase())
              .filter((email) => email.length > 0 && email.includes("@"));
          }

          // Remove duplicates
          const uniqueEmails = [...new Set(emails)];
          const validEmails = uniqueEmails.filter(validateEmail);

          resolve({
            total: emails.length,
            unique: uniqueEmails.length,
            valid: validEmails.length,
            emails: validEmails,
          });
        } catch (err) {
          reject(new Error("Failed to parse file content"));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }, []);
  const handleFile = useCallback(
    async (selectedFile) => {
      setError("");

      if (!selectedFile) return;

      // Validate file type
      const fileExtension =
        "." + selectedFile?.name?.split(".")?.pop()?.toLowerCase();
      if (!ALLOWED_TYPES?.includes(fileExtension)) {
        setError(
          `Invalid file type. Please upload ${ALLOWED_TYPES?.join(
            " or "
          )} files only.`
        );
        return;
      }

      // Validate file size
      if (selectedFile?.size > MAX_FILE_SIZE) {
        setError(`File size exceeds 10MB limit. Please upload a smaller file.`);
        return;
      }

      try {
        setFile(selectedFile);
        const stats = await parseFile(selectedFile);

        if (stats?.valid === 0) {
          setError("No valid email addresses found in the file.");
          setFileStats(null);
          return;
        }

        if (stats?.valid > MAX_EMAILS) {
          setError(
            `File contains ${stats?.valid?.toLocaleString()} emails. Maximum ${MAX_EMAILS?.toLocaleString()} emails allowed per batch.`
          );
          setFileStats(null);
          return;
        }

        setFileStats(stats);
      } catch (err) {
        setError(err?.message);
        setFileStats(null);
      }
    },
    [parseFile]
  );

  const handleDrag = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      setDragActive(false);

      if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
        handleFile(e?.dataTransfer?.files?.[0]);
      }
    },
    [handleFile]
  );

  const handleFileSelect = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFile(e?.target?.files?.[0]);
    }
  };


 const handleSubmit = async (e) => {
  e?.preventDefault();

  if (!file || !(file instanceof File)) {
    setError("Please select a valid file first");
    return;
  }

  setError("");

  try {
    const stats = await parseFile(file);

    if (!stats?.valid || stats.valid === 0) {
      setError("No valid emails found in the file.");
      return;
    }

    // 🚀 Call your n8n webhook directly
    const response = await n8nService.verifyFile(file);

    // Normalize response similar to EmailVerificationHub
    const results = response?.data?.[0]?.json || response?.data || response;

    // ✅ Navigate to ResultsDashboard with webhook response
    navigate("/results-dashboard", {
      state: {
        verificationResults: results?.summary,
        detailedResults: results?.results,
        warning: results?.warning,
        timestamp: new Date().toISOString(),
      },
    });

    setFileStats((prev) => ({ ...prev, verified: true }));
  } catch (err) {
    console.error("File upload error:", err);
    setError("Failed to upload file. Please try again.");
  }
};

  const handleClear = () => {
    setFile(null);
    setFileStats(null);
    setError("");
    if (fileInputRef?.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Upload" size={20} className="text-primary" />
        <h3 className="font-heading font-medium text-foreground">
          File Upload Verification
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload Zone */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-smooth cursor-pointer
            ${
              dragActive
                ? "border-primary bg-primary/5"
                : file
                ? "border-success bg-success/5"
                : "border-border hover:border-primary hover:bg-muted/50"
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />

          <div className="space-y-3">
            <div
              className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                file
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon name={file ? "CheckCircle" : "Upload"} size={24} />
            </div>

            {file ? (
              <div>
                <p className="font-medium text-foreground">{file?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file?.size / 1024 / 1024)?.toFixed(2)} MB • Ready to process
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-foreground">
                  {dragActive
                    ? "Drop your file here"
                    : "Drag & drop your file here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Supports CSV and TXT files up to 10MB
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2 text-error">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* File Statistics */}
        {fileStats && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {fileStats?.total?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Found</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {fileStats?.unique?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Unique</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-success">
                {fileStats?.valid?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Valid Format</div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={isProcessing || !file}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear File
          </Button>

          <Button
            type="submit"
            variant="default"
            disabled={isProcessing || !fileStats || fileStats?.valid === 0}
            loading={isProcessing}
            iconName="CheckCircle"
            iconPosition="left"
            iconSize={16}
          >
            {isProcessing
              ? "Processing..."
              : `Verify ${fileStats?.valid?.toLocaleString() || 0} Emails`}
          </Button>
        </div>
      </form>
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">
              Supported File Formats
            </p>
            <p>
              Upload CSV or TXT files containing email addresses. Files are
              parsed automatically with duplicate removal and format validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadForm;
