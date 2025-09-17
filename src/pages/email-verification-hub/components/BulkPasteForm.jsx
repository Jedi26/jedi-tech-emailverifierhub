import React, { useState, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkPasteForm = ({ onVerify, isProcessing }) => {
  const [emailText, setEmailText] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, unique: 0, valid: 0 });

  const MAX_EMAILS = 10000;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const processEmails = useCallback((text) => {
    if (!text?.trim()) {
      setStats({ total: 0, unique: 0, valid: 0 });
      return;
    }

    // Split by common delimiters and clean up
    const emails = text?.split(/[\n,;|\s]+/)?.map(email => email?.trim()?.toLowerCase())?.filter(email => email?.length > 0);

    // Remove duplicates
    const uniqueEmails = [...new Set(emails)];
    
    // Count valid emails
    const validEmails = uniqueEmails?.filter(validateEmail);

    setStats({
      total: emails?.length,
      unique: uniqueEmails?.length,
      valid: validEmails?.length
    });
  }, []);

  const handleTextChange = (e) => {
    const text = e?.target?.value;
    setEmailText(text);
    setError('');
    processEmails(text);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');

    if (!emailText?.trim()) {
      setError('Please paste email addresses to verify');
      return;
    }

    const emails = emailText?.split(/[\n,;|\s]+/)?.map(email => email?.trim()?.toLowerCase())?.filter(email => email?.length > 0);

    const uniqueEmails = [...new Set(emails)];

    if (uniqueEmails?.length === 0) {
      setError('No valid email addresses found');
      return;
    }

    if (uniqueEmails?.length > MAX_EMAILS) {
      setError(`Maximum ${MAX_EMAILS?.toLocaleString()} emails allowed per batch`);
      return;
    }

    const validEmails = uniqueEmails?.filter(validateEmail);
    
    if (validEmails?.length === 0) {
      setError('No valid email format found. Please check your email addresses.');
      return;
    }

    onVerify(validEmails);
  };

  const handleClear = () => {
    setEmailText('');
    setError('');
    setStats({ total: 0, unique: 0, valid: 0 });
  };

  const handlePasteSample = () => {
    const sampleEmails = `john.doe@example.com
jane.smith@company.org
test@domain.co.uk
user123@sample.net
contact@business.com`;
    setEmailText(sampleEmails);
    processEmails(sampleEmails);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="font-heading font-medium text-foreground">Bulk Email Verification</h3>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handlePasteSample}
          disabled={isProcessing}
          iconName="Copy"
          iconPosition="left"
          iconSize={14}
        >
          Paste Sample
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Email Addresses
            <span className="text-error ml-1">*</span>
          </label>
          <textarea
            value={emailText}
            onChange={handleTextChange}
            placeholder={`Paste your email addresses here...
Supported formats:
• One email per line
• Comma separated: email1@domain.com, email2@domain.com
• Space separated: email1@domain.com email2@domain.com`}
            className="w-full h-48 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            disabled={isProcessing}
            required
          />
          {error && (
            <p className="text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* Statistics */}
        {stats?.total > 0 && (
          <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{stats?.total?.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Found</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">{stats?.unique?.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Unique</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-success">{stats?.valid?.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Valid Format</div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={isProcessing || !emailText}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear All
          </Button>

          <Button
            type="submit"
            variant="default"
            disabled={isProcessing || stats?.valid === 0}
            loading={isProcessing}
            iconName="CheckCircle"
            iconPosition="left"
            iconSize={16}
          >
            {isProcessing ? 'Processing...' : `Verify ${stats?.valid?.toLocaleString()} Emails`}
          </Button>
        </div>
      </form>
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Bulk Processing Limits</p>
            {/* <p>Maximum {MAX_EMAILS?.toLocaleString()} emails per batch. Duplicates are automatically removed. Supports multiple formats including line breaks, commas, and spaces.</p>*/}
            <p>Maximum 100 emails per batch. Duplicates are automatically removed. Supports multiple formats including line breaks, commas, and spaces.</p> 
         
         </div>
        </div>
      </div>
    </div>
  );
};

export default BulkPasteForm;