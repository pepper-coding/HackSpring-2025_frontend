"use client";

import { useState } from "react";
import { AnalyticsPanel } from "@/widgets/Analytics";
import { StoreCanvas } from "@/widgets/StoreCanvas";
import { Header } from "@/widgets/Header";
import { StoreControls } from "@/widgets/StoreControls";

export default function Home() {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <main>
      <div className="flex flex-col h-screen">
        <Header
          setShowAnalytics={setShowAnalytics}
          showAnalytics={showAnalytics}
        />
        <div className="flex flex-col h-screen">
          <div className="flex flex-1 overflow-hidden">
            <div className="w-80 flex-none bg-muted p-4 overflow-y-auto">
              <StoreControls />
            </div>

            <div className="flex-1 w-full h-full">
              <StoreCanvas showAnalytics={showAnalytics} />
            </div>

            {showAnalytics && (
              <div className="w-96 flex-none bg-muted p-4 overflow-y-auto">
                <AnalyticsPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
