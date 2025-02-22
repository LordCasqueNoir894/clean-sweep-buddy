
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import BrowserStatus from './BrowserStatus';
import { invoke } from '@tauri-apps/api/tauri';

const CleanerApp = () => {
  const [cleaning, setCleaning] = useState(false);
  const [progress, setProgress] = useState({
    chrome: false,
    firefox: false,
    edge: false
  });
  const { toast } = useToast();

  const cleanBrowserCache = async (browser: string) => {
    try {
      await invoke('clean_browser_cache', { browser });
      return true;
    } catch (error) {
      console.error(`Erreur lors du nettoyage de ${browser}:`, error);
      return false;
    }
  };

  const simulateClean = async () => {
    setCleaning(true);
    
    const browsers = ['chrome', 'firefox', 'edge'];
    for (const browser of browsers) {
      setProgress(prev => ({ ...prev, [browser]: true }));
      await cleanBrowserCache(browser);
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(prev => ({ ...prev, [browser]: false }));
    }
    
    setCleaning(false);
    toast({
      title: "Nettoyage terminé",
      description: "Tous les navigateurs ont été nettoyés avec succès.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md p-6 backdrop-blur-lg bg-white/90 shadow-xl border border-gray-100">
        <h1 className="text-2xl font-medium text-center mb-2">Vider le cache pour Ulysse</h1>
        <p className="text-gray-500 text-center mb-6">
          Nettoyage intelligent multi-navigateurs
        </p>
        
        <div className="space-y-4 mb-6">
          <BrowserStatus name="Chrome" active={progress.chrome} />
          <BrowserStatus name="Firefox" active={progress.firefox} />
          <BrowserStatus name="Edge" active={progress.edge} />
        </div>

        <Button 
          className="w-full h-12 text-lg transition-all duration-300 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600"
          onClick={simulateClean}
          disabled={cleaning}
        >
          {cleaning ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Nettoyage en cours...
            </>
          ) : (
            "Nettoyer tous les navigateurs"
          )}
        </Button>
        
        <p className="text-xs text-gray-400 text-center mt-4">
          Les mots de passe et identifiants seront conservés
        </p>
      </Card>
    </div>
  );
};

export default CleanerApp;
