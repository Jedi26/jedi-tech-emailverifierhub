import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SingleEmailForm = ({ onVerify, isProcessing }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');

    if (!email?.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!validateEmail(email?.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    onVerify([email?.trim()]);
  };

  const handleClear = () => {
    setEmail('');
    setError('');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Mail" size={20} className="text-primary" />
        <h3 className="font-heading font-medium text-foreground">Single Email Verification</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email Address"
          placeholder="Enter email address to verify"
          value={email}
          onChange={(e) => setEmail(e?.target?.value)}
          error={error}
          disabled={isProcessing}
          required
          className="text-black"
        />

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={isProcessing || !email}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear
          </Button>

          <Button
            type="submit"
            variant="default"
            disabled={isProcessing || !email}
            loading={isProcessing}
            iconName="CheckCircle"
            iconPosition="left"
            iconSize={16}
          >
            {isProcessing ? 'Verifying...' : 'Verify Email'}
          </Button>
        </div>
      </form>
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Single Email Verification</p>
            <p>Instantly verify the deliverability and validity of any email address with detailed results including domain and MX record validation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleEmailForm;