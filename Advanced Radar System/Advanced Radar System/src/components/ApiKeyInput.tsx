
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Key } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  hasApiKey: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, hasApiKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(!hasApiKey);

  const handleSubmit = () => {
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      setIsVisible(false);
    }
  };

  if (!isVisible && hasApiKey) {
    return (
      <Button 
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="bg-gray-800 border-green-500 border-opacity-30 text-green-400 hover:bg-gray-700"
      >
        <Key className="w-4 h-4 mr-2" />
        Update API Key
      </Button>
    );
  }

  return (
    <Card className="bg-gray-800 border-green-500 border-opacity-30 mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-400 font-mono text-sm">
          ELEVENLABS API KEY
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-green-300 text-xs font-mono">
          Enter your ElevenLabs API key for high-quality voice announcements
        </p>
        <Input
          type="password"
          placeholder="Enter API key..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="bg-gray-700 border-green-500 border-opacity-30 text-white font-mono"
        />
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-mono flex-1"
          >
            Set API Key
          </Button>
          {hasApiKey && (
            <Button
              onClick={() => setIsVisible(false)}
              variant="outline"
              className="bg-gray-700 border-green-500 border-opacity-30 text-green-400"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
