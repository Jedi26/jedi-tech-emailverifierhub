import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import MainNavigation from "../../components/ui/MainNavigation";
import ProcessingStatusBar from "../../components/ui/ProcessingStatusBar";
import ExportControls from "../../components/ui/ExportControls";
import SummaryStats from "./components/SummaryStats";
import FilterControls from "./components/FilterControls";
import ResultsTable from "./components/ResultsTable";
import QuickActions from "./components/QuickActions";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const ResultsDashboard = () => {
  const location = useLocation();
  const { verificationResults, detailedResults, warning, timestamp } =
    location.state || {};

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    domainType: "all",
    mxRecord: "all",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [exportInProgress, setExportInProgress] = useState(false);

  useEffect(() => {
    if (detailedResults?.length) setResults(detailedResults);
    else if (verificationResults?.results?.length) setResults(verificationResults.results);
    else setResults([]);
    setLoading(false);
  }, [detailedResults, verificationResults]);

  const stats = useMemo(() => {
  if (verificationResults?.summary) {
    const total = verificationResults.summary.totalProcessed ?? verificationResults.results?.length ?? 0;
    const valid = verificationResults.summary.valid ?? verificationResults.results?.filter((r) => r.status?.toUpperCase() === "VALID").length ?? 0;
    const validRate =
      verificationResults.summary.validRate ?? (total > 0 ? (valid / total) * 100 : 0);

    return {
      totalProcessed: total,
      validRate,
      averageProcessingTime: verificationResults.summary.averageProcessingTime ?? 1.25,
    };
  }

  const total = results.length;
  const valid = results.filter((r) => r.status?.toUpperCase() === "VALID").length;
  return {
    totalProcessed: total,
    validRate: total > 0 ? (valid / total) * 100 : 0,
    averageProcessingTime: 1.25,
  };
}, [verificationResults, results]);


  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const email = r.email?.toLowerCase() ?? "";
      const domain = r.domain?.toLowerCase() ?? "";
      const status = r.status?.toLowerCase() ?? "";
      const domainType = r.domainType?.toLowerCase() ?? "";
      const hasMX = r.hasMXRecord;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!email.includes(q) && !domain.includes(q)) return false;
      }
      if (filters.status !== "all" && status !== filters.status.toLowerCase()) return false;
      if (filters.domainType !== "all" && domainType !== filters.domainType.toLowerCase()) return false;
      if (filters.mxRecord !== "all") {
        const matchMX = filters.mxRecord === "valid";
        if (hasMX !== matchMX) return false;
      }
      return true;
    });
  }, [results, searchQuery, filters]);

  const resultCounts = useMemo(() => {
    const total = results.length;
    const filtered = filteredResults.length;
    const valid = filteredResults.filter((r) => r.status?.toLowerCase() === "valid").length;
    const invalid = filteredResults.filter((r) => r.status?.toLowerCase() === "invalid").length;
    const disposable = filteredResults.filter((r) => r.status?.toLowerCase() === "disposable").length;
    const risky = filteredResults.filter((r) => r.status?.toLowerCase() === "risky").length;

    return { total, filtered, valid, invalid, disposable, risky };
  }, [results, filteredResults]);

  const handleExport = (options) => {
    setExportInProgress(true);
    setTimeout(() => {
      const data =
        options.scope === "filtered"
          ? filteredResults
          : options.scope === "selected"
          ? results.filter((r) => selectedEmails.includes(r.email))
          : results;
      const filename = `email-verification-results-${new Date().toISOString().split("T")[0]}.csv`;
      exportToCSV(data, filename);
      setExportInProgress(false);
    }, 500);
  };

  const handleExportSelected = () => {
    if (!selectedEmails.length) return;
    handleExport({ scope: "selected" });
  };

  const handleExportValid = () => handleExport({ scope: "filtered" });
  const handleExportInvalid = () => handleExport({ scope: "filtered" });
  const handleClearFilters = () => {
    setFilters({ status: "all", domainType: "all", mxRecord: "all" });
    setSearchQuery("");
    setSelectedEmails([]);
  };

  const exportToCSV = (data, filename = "email-verification-results.csv") => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(",") + "\n";
    const rows = data
      .map((row) => Object.values(row).map((value) => `"${value ?? ""}"`).join(","))
      .join("\n");
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-teal-900 to-green-800 text-white">
      <MainNavigation
        processingState={null}
        resultCount={results.length}
        exportInProgress={exportInProgress}
      />
      <main className="container mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Glass-like Summary Stats */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
          <SummaryStats
            totalProcessed={stats.totalProcessed}
            validRate={Number(stats.validRate.toFixed(2))}
            averageProcessingTime={stats.averageProcessingTime}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
              <FilterControls
                onFilterChange={setFilters}
                onSearchChange={setSearchQuery}
                filters={filters}
                searchQuery={searchQuery}
                resultCounts={resultCounts}
                onClearFilters={handleClearFilters}
              />
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
              <ResultsTable
                results={filteredResults}
                selectedEmails={selectedEmails}
                onSelectionChange={setSelectedEmails}
                onSort={setSortConfig}
                sortConfig={sortConfig}
                loading={loading}
                onExportSelected={handleExportSelected}
              />
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
              <QuickActions
                selectedCount={selectedEmails.length}
                totalResults={results.length}
                onExportSelected={handleExportSelected}
                onExportAll={() =>
                  handleExport({
                    format: "csv",
                    scope: "all",
                    count: results.length,
                  })
                }
                onExportValid={handleExportValid}
                onExportInvalid={handleExportInvalid}
                exportInProgress={exportInProgress}
              />
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
              <ExportControls
                resultCount={results.length}
                filteredCount={filteredResults.length}
                onExport={handleExport}
                exportInProgress={exportInProgress}
                availableFormats={["csv", "xlsx", "json"]}
              />
            </div>
          </div>
        </div>
      </main>

        <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 text-center p-4 text-sm">
      © 2025 Jedi Bentillo. All rights reserved.
    </footer>
    </div>
  );
};

export default ResultsDashboard;
