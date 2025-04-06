import { useAppSelector } from "@/shared/hooks/useAppSelector";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSimulationActions } from "../model/slice/simulationSlice";
import { useGetSimulationMutation } from "../api/simulation.api";
import { useCustomersActions } from "@/entities/Customers";
import { useAnalyticsActions } from "@/entities/Analytics";

export const Simulation = () => {
  const { time, isRunning } = useAppSelector((state) => state.timer);
  const [lastMinute, setLastMinute] = useState<number>(
    moment(time).get("minutes")
  );
  const { setSimulationState } = useSimulationActions();
  const { setCustomersFromSimulation } = useCustomersActions();
  const { setSimulationStats } = useAnalyticsActions();
  const [getSimulation] = useGetSimulationMutation();
  const shelves = useAppSelector((state) => state.shelves.items);
  const storeSize = useAppSelector((state) => state.store);
  
  // Add debug output for simulation state
  const simulationState = useAppSelector(state => state.simulation.simulationState);
  useEffect(() => {
    console.log('Current simulation state:', simulationState);
    if (simulationState?.heatmap) {
      console.log('Heatmap dimensions:', simulationState.heatmap.length, 'x', 
                 simulationState.heatmap[0]?.length);
    }
  }, [simulationState]);

  const onSimulate = async () => {
    console.log('Running simulation...');
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
      console.log('Simulation data received:', result.data);
      console.log('Heatmap data received:', result.data.heatmap);
      
      const { visitors, ...simulationDataWithoutVisitors } = result.data;
      
      // Убедимся, что тепловая карта не потеряется при сохранении
      if (!simulationDataWithoutVisitors.heatmap && result.data.heatmap) {
        console.log("Explicitly preserving heatmap data");
        simulationDataWithoutVisitors.heatmap = result.data.heatmap;
      }
      
      setSimulationState(simulationDataWithoutVisitors);
      setCustomersFromSimulation({ visitors: result.data.visitors });
      
      if (result.data.stats) {
        setSimulationStats(result.data.stats);
      }
    }
  };

  // Запускаем симуляцию при первом рендере, чтобы получить данные тепловой карты
  useEffect(() => {
    console.log('Initial simulation run...');
    onSimulate();
  }, []);

  useEffect(() => {
    if (isRunning && lastMinute !== moment(time).get("minutes")) {
      setLastMinute(moment(time).get("minutes"));
      onSimulate();
    }
  }, [time]);

  return null;
};
