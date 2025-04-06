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
import moment from "moment";

export const VirtualTimer = () => {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setBooster, setIsRunning, setTime } = useTimerActions();
  const { booster, isRunning, time } = useAppSelector((state) => state.timer);
  const handleTimeChange = () => {
    if (isRunning) {
      const newTime = moment(time).add(1, "seconds");
      setTime(newTime.toISOString());
    }
  };

  const callbackRef = useRef(handleTimeChange);

  callbackRef.current = handleTimeChange;

  useEffect(() => {
    timer.current = setInterval(() => callbackRef.current(), 200 / booster);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [booster, isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex items-center gap-2 ">
      <p className="font-semibold">{moment(time).format("HH:mm:ss")}</p>
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
