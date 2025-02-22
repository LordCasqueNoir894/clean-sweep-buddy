
import React from 'react';
import { Chrome, Firefox, MonitorCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrowserStatusProps {
  name: string;
  active: boolean;
}

const BrowserStatus = ({ name, active }: BrowserStatusProps) => {
  const getIcon = () => {
    switch (name.toLowerCase()) {
      case 'chrome':
        return <Chrome className="h-5 w-5" />;
      case 'firefox':
        return <Firefox className="h-5 w-5" />;
      case 'edge':
        return <MonitorCheck className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg transition-colors duration-300",
      active ? "bg-gray-100" : "bg-transparent"
    )}>
      <div className="flex items-center space-x-3">
        {getIcon()}
        <span className="font-medium">{name}</span>
      </div>
      <div className={cn(
        "h-2 w-2 rounded-full transition-colors duration-300",
        active ? "bg-green-400" : "bg-gray-300"
      )} />
    </div>
  );
};

export default BrowserStatus;
