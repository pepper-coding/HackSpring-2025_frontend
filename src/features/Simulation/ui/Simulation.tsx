import { useAppSelector } from "@/shared/hooks/useAppSelector";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSimulationActions } from "../model/slice/simulationSlice";
import { useGetSimulationMutation } from "../api/simulation.api";

export const Simulation = () => {
  const { time, isRunning } = useAppSelector((state) => state.timer);
  const [lastMinute, setLastMinute] = useState<number>(
    moment(time).get("minutes")
  );
  const { setSimulationState } = useSimulationActions();
  const [getSimulation] = useGetSimulationMutation();

  const onSimulate = async () => {
    const result = await getSimulation({
      config: {},
    });
    setSimulationState(result);
  };

  useEffect(() => {
    if (isRunning && lastMinute !== moment(time).get("minutes")) {
      setLastMinute(moment(time).get("minutes"));
    }
  }, [time]);

  return null;
};
