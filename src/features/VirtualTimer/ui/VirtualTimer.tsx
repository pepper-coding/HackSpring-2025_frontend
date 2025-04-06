import React, { useEffect, useRef } from "react";
import { useTimerActions } from "../model/timerSlice";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";

const formatTime = (time: number): string => {
  const hours = (Math.floor(time / 3600) % 24).toString().padStart(2, "0");
  const minutes = (Math.floor((time % 3600) / 60) % 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.round(time % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${sec}`;
};

export const VirtualTimer = () => {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setBooster, setIsRunning, setTime } = useTimerActions();
  const { booster, isRunning, time } = useAppSelector((state) => state.timer);

  useEffect(() => {
    timer.current = setInterval(() => {
      if (isRunning) {
        const date = new Date(time);
        date.setSeconds(date.getSeconds() + 5);
        setTime(date.toISOString());
      }
    }, 1000 / booster);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        setIsRunning(false);
      }
    };
  }, [booster, isRunning, time, setTime]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex items-center gap-2 ">
      <p>{formatTime(new Date(time).getTime() / 1000)}</p>
      <Button onClick={handleStartStop}>{isRunning ? "Stop" : "Start"}</Button>
      <Select
        value={String(booster)}
        onValueChange={(id) => setBooster(Number(id))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Time Booster" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1x</SelectItem>
          <SelectItem value="2">2x</SelectItem>
          <SelectItem value="3">3x</SelectItem>
          <SelectItem value="4">4x</SelectItem>
          <SelectItem value="5">5x</SelectItem>
          <SelectItem value="10">10x</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
