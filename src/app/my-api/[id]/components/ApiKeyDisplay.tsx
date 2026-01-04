"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ApiKeyDisplayProps {
  apiKey: string;
}

export function ApiKeyDisplay({ apiKey }: ApiKeyDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maskedKey = apiKey.replace(/./g, "•");
  const displayKey = isVisible ? apiKey : maskedKey;

  return (
    <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg border">
      <Input
        value={displayKey}
        readOnly
        className="font-mono text-sm flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
