"use client";
import { Button } from "@/shared/components/ui/button";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import React, { FC, use, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { DetailedAnalytics } from "@/widgets/DetailedAnalytics";
import { StoreProvider } from "@/app/providers/store";
import { useUpdateManyShelvesMutation } from "@/entities/Shelves/api/shelves.api";
import { Loader } from "lucide-react";

export interface HeaderProps {
  setShowAnalytics: (showAnalytics: boolean) => void;
  showAnalytics: boolean;
}

export const Header: FC<HeaderProps> = ({
  setShowAnalytics,
  showAnalytics,
}) => {
  const [updateShelves, { isLoading }] = useUpdateManyShelvesMutation();
  const shelves = useAppSelector((state) => state.shelves.items);
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  const handleSavePreset = async () => {
    await updateShelves(shelves);
  };

  return (
    <>
      <div className="flex-none bg-background p-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">3D Store Planner</h1>
          <div className="flex gap-2">
            <button
              onClick={handleSavePreset}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Save Preset
            </button>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              {showAnalytics ? "Hide Mini Analytics" : "Show Mini Analytics"}
            </button>
            <Button
              onClick={() => setShowDetailedAnalytics(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? <Loader /> : "Detailed Analytics"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={showDetailedAnalytics}
        onOpenChange={setShowDetailedAnalytics}
      >
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Detailed Analytics
            </DialogTitle>
            <DialogClose />
          </DialogHeader>
          <StoreProvider>
            <DetailedAnalytics />
          </StoreProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};
