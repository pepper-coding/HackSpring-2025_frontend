"use client";
import { Button } from "@/shared/components/ui/button";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import React, { FC } from "react";

export interface HeaderProps {
  setShowAnalytics: (showAnalytics: boolean) => void;
  showAnalytics: boolean;
}

export const Header: FC<HeaderProps> = ({
  setShowAnalytics,
  showAnalytics,
}) => {
  const storeSize = useAppSelector((state) => state.store);
  const shelves = useAppSelector((state) => state.shelves.items);

  const handleSavePreset = () => {
    const presetData = {
      storeSize,
      shelves: shelves.map((shelf) => ({
        id: shelf.id,
        type: shelf.type,
        position: shelf.position,
        rotation: shelf.rotation,
        size: shelf.size,
        interactions: shelf.interactions,
      })),
      createdAt: new Date().toISOString(),
    };

    console.log("Preset data:", presetData);
  };

  return (
    <div className="flex-none bg-background p-4 border-b">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">3D Store Planner</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSavePreset}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Сохранить пресет
          </button>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </button>
        </div>
      </div>
    </div>
  );
};
