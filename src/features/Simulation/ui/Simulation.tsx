import { useAppSelector } from "@/shared/hooks/useAppSelector";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSimulationActions } from "../model/slice/simulationSlice";
import { useGetSimulationMutation } from "../api/simulation.api";
import { useCustomersActions } from "@/entities/Customers";

export const Simulation = () => {
  const { time, isRunning } = useAppSelector((state) => state.timer);
  const [lastMinute, setLastMinute] = useState<number>(
    moment(time).get("minutes")
  );
  const { setSimulationState } = useSimulationActions();
  const { setCustomersFromSimulation } = useCustomersActions();
  const [getSimulation] = useGetSimulationMutation();
  const shelves = useAppSelector((state) => state.shelves.items);
  const storeSize = useAppSelector((state) => state.store);

  const onSimulate = async () => {
    const result = await getSimulation({
      config: {
        cashDesks: shelves
          .filter((shelf) => shelf.type === "cashier")
          .map((shelf) => ({
            x: shelf.x,
            y: 0,
            z: shelf.y,
          })),

        createdAt: moment(time).toISOString(),
        shelves: shelves
          .filter((shelf) => shelf.type !== "cashier")
          .map((shelf) => ({
            id: `${shelf.size}-${shelf.type}-${shelf.id.replaceAll("-", "_")}`,
            position: { x: shelf.x, y: 0, z: shelf.y },
            rotation: shelf.rotation,
            interactions: shelf.interactions,
            discount: shelf.discount,
          })),
        storeSize,
        entrance: { x: storeSize.width / 2, y: 0, z: storeSize.length / 2 },
      },
      timeOfDay: moment(time).format("HH:mm"),
    });
    
    if (result.data) {
      setSimulationState(result.data);
      setCustomersFromSimulation({ visitors: result.data.visitors });
    }
  };

  useEffect(() => {
    if (isRunning && lastMinute !== moment(time).get("minutes")) {
      setLastMinute(moment(time).get("minutes"));
      onSimulate();
    }
  }, [time]);

  return null;
};
