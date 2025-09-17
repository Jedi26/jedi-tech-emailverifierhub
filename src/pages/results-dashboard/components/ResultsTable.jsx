import React, { useState, useMemo } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";

const ResultsTable = ({
  results = [],
  selectedEmails = [],
  onSelectionChange = () => {},
  onSort = () => {},
  sortConfig = { key: null, direction: "asc" },
  loading = false,
  onExportSelected = () => {},
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();

    const statusConfig = {
      valid: {
        color: "bg-success/10 text-success border-success/20",
        icon: "CheckCircle",
        label: "Valid",
      },
      invalid: {
        color: "bg-error/10 text-error border-error/20",
        icon: "XCircle",
        label: "Invalid",
      },
      disposable: {
        color: "bg-warning/10 text-warning border-warning/20",
        icon: "AlertTriangle",
        label: "Disposable",
      },
      risky: {
        color: "bg-secondary/10 text-secondary border-secondary/20",
        icon: "Shield",
        label: "Risky",
      },
    };

    const config = statusConfig?.[normalizedStatus] || statusConfig.invalid;

    return (
      <span
        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <Icon name={config.icon} size={12} />
        <span>{config.label}</span>
      </span>
    );
  };

  const getMXStatusIcon = (hasMX) =>
    hasMX ? (
      <Icon name="CheckCircle" size={16} className="text-success" />
    ) : (
      <Icon name="XCircle" size={16} className="text-error" />
    );

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    onSelectionChange(checked ? results?.map((r) => r?.email) : []);
  };

  const handleSelectEmail = (email, checked) => {
    if (checked) {
      onSelectionChange([...selectedEmails, email]);
    } else {
      onSelectionChange(selectedEmails?.filter((e) => e !== email));
      setSelectAll(false);
    }
  };

  const handleSort = (key) => {
    const direction =
      sortConfig?.key === key && sortConfig?.direction === "asc"
        ? "desc"
        : "asc";
    onSort({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return "ArrowUpDown";
    return sortConfig?.direction === "asc" ? "ArrowUp" : "ArrowDown";
  };

  const sortedResults = useMemo(() => {
    if (!sortConfig?.key) return results;
    return [...results]?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (typeof aValue === "string") {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) return sortConfig?.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [results, sortConfig]);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading verification results...
          </p>
        </div>
      </div>
    );
  }

  if (results?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-12 text-center">
          <Icon
            name="Mail"
            size={48}
            className="text-muted-foreground mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Results Available
          </h3>
          <p className="text-muted-foreground mb-6">
            Start by verifying some emails to see detailed results here.
          </p>
          <Button variant="default" iconName="Upload" iconPosition="left">
            Start Verification
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full rounded-2xl overflow-hidden">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4 rounded-tl-2xl">
                <Checkbox
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort("email")}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Email Address</span>
                  <Icon name={getSortIcon("email")} size={16} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon("status")} size={16} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort("domain")}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Domain</span>
                  <Icon name={getSortIcon("domain")} size={16} />
                </button>
              </th>
              <th className="text-center p-4">
                <span className="font-medium text-foreground">MX Record</span>
              </th>
              <th className="text-left p-4 rounded-tr-2xl">
                <button
                  onClick={() => handleSort("verifiedAt")}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Verified</span>
                  <Icon name={getSortIcon("verifiedAt")} size={16} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedResults?.map((result) => (
              <tr
                key={result?.email}
                className="border-b border-border hover:bg-muted/30 transition-smooth"
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedEmails?.includes(result?.email)}
                    onChange={(e) =>
                      handleSelectEmail(result?.email, e?.target?.checked)
                    }
                  />
                </td>
                <td className="p-4">
                  <div className="font-medium text-foreground">
                    {result?.email}
                  </div>
                </td>
                <td className="p-4">{getStatusBadge(result?.status)}</td>
                <td className="p-4">
                  <span className="text-muted-foreground">{result?.domain}</span>
                </td>
                <td className="p-4 text-center">{getMXStatusIcon(result?.hasMXRecord)}</td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(result.verifiedAt)?.toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedResults?.map((result) => (
          <div
            key={result?.email}
            className="border border-border rounded-2xl p-4 space-y-3 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {result?.email}
                </div>
                <div className="text-sm text-muted-foreground">{result?.domain}</div>
              </div>
              <Checkbox
                checked={selectedEmails?.includes(result?.email)}
                onChange={(e) => handleSelectEmail(result?.email, e?.target?.checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              {getStatusBadge(result?.status)}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">MX:</span>
                {getMXStatusIcon(result?.hasMXRecord)}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Verified: {new Date(result.verifiedAt)?.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedEmails?.length > 0 && (
        <div className="bg-primary/5 border-t border-border p-4 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {selectedEmails?.length} email
              {selectedEmails?.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onSelectionChange([]);
                  setSelectAll(false);
                }}
                iconName="X"
                iconPosition="left"
                iconSize={14}
                className="rounded-lg"
              >
                Clear
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Download"
                iconPosition="left"
                iconSize={14}
                onClick={onExportSelected}
                className="rounded-lg"
              >
                Export Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
