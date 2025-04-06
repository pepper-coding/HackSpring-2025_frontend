import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useCustomersActions } from "@/entities/Customers/model/slice/customersSlice";
import { useAnalyticsActions } from "@/entities/Analytics/model/analyticsSlice";
import { useShelvesActions } from "@/entities/Shelves/model/shelvesSlice";
import { Customer } from "@/entities/Customers/ui/Customer";

interface PathPoint {
  x: number;
  y: number;
  z: number;
  time?: number;
}

interface VisitorData {
  id: number;
  preferences: string[];
  path: [number, number][];
  queue_time: number;
  visited_shelves: string[];
  final_position: [number, number];
}

interface CustomersData {
  visitors: VisitorData[];
  heatmap: number[][];
  events: {
    broken_cash_desk: boolean;
    promotions: any[];
  };
  stats: {
    total_visitors: number;
    avg_queue_time: number;
    max_queue_length: number;
    time_of_day: string;
    calculated_visitors: number;
  };
  store_dimensions: {
    width: number;
    length: number;
    grid_size: number;
  };
}

export function CustomerRoutes({ data }: { data: CustomersData }) {
  const { visitors } = data;

  const { setCustomerTarget, removeCustomer, updateCustomerPosition } =
    useCustomersActions();
  const { recordInteraction } = useAnalyticsActions();
  const { incrementInteraction } = useShelvesActions();

  const customerPathsMap = useMemo(() => {
    const map = new Map<string, PathPoint[]>();

    visitors.forEach((visitor) => {
      const pathPoints: PathPoint[] = visitor.path.map(([x, z], index) => ({
        x,
        y: 0,
        z,
        // Добавляем примерное время для каждой точки (можно настроить)
        time: index * 5, // 5 секунд на перемещение между точками
      }));

      map.set(visitor.id.toString(), pathPoints);
    });

    return map;
  }, [visitors]);

  // Оптимизация: создаем кэш для позиций полок
  const shelfPositionsCache = useMemo(() => {
    const cache = new Map<string, THREE.Vector3>();

    // Здесь можно заполнить кэш на основе ваших данных о полках
    // Пример:
    // shelves.forEach(shelf => {
    //   cache.set(shelf.id, new THREE.Vector3(shelf.x, 0, shelf.y));
    // });

    return cache;
  }, []);

  // Оптимизация: кэшируем векторы для расчетов
  const tempVectors = useMemo(
    () => ({
      position: new THREE.Vector3(),
      direction: new THREE.Vector3(),
      target: new THREE.Vector3(),
    }),
    []
  );

  // Ссылки на объекты линий маршрутов
  const pathLinesRef = useRef<Map<string, THREE.Line>>(new Map());

  // Состояние анимации для каждого покупателя
  const customerAnimationState = useRef<
    Map<
      string,
      {
        currentPathIndex: number;
        startTime: number;
        journeyStarted: boolean;
      }
    >
  >(new Map());

  // Оптимизация: используем instanced buffer для визуализации маршрутов
  const createPathLine = (
    customerId: string,
    points: PathPoint[]
  ): THREE.Line => {
    // Создаем геометрию из точек маршрута
    const geometry = new THREE.BufferGeometry();

    // Преобразуем массив точек в массив позиций для буфера
    const positions = new Float32Array(points.length * 3);

    points.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = 0.1; // Немного приподнимаем над полом
      positions[i * 3 + 2] = point.z;
    });

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Создаем материал для линии
    const material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      opacity: 0.5,
      transparent: true,
    });

    // Возвращаем линию
    return new THREE.Line(geometry, material);
  };

  // Этот эффект запускается один раз и создает необходимые структуры данных
  useEffect(() => {
    // Инициализируем состояние анимации для каждого покупателя
    visitors.forEach((visitor) => {
      customerAnimationState.current.set(visitor.id.toString(), {
        currentPathIndex: 0,
        startTime: 0,
        journeyStarted: false,
      });
    });

    return () => {
      // Очистка ресурсов при размонтировании
      pathLinesRef.current.clear();
      customerAnimationState.current.clear();
    };
  }, [visitors]);

  // Основной цикл анимации движения покупателей по заданным маршрутам
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    visitors.forEach((visitor) => {
      const customerId = visitor.id.toString();
      const pathPoints = customerPathsMap.get(customerId);

      if (!pathPoints || pathPoints.length < 2) return;

      const animState = customerAnimationState.current.get(customerId);
      if (!animState) return;

      if (!animState.journeyStarted) {
        animState.startTime = time + visitor.id * 0.5;
        animState.journeyStarted = true;
        return;
      }

      if (time < animState.startTime) return;

      if (animState.currentPathIndex >= pathPoints.length - 1) {
        const finalPosition = tempVectors.position.set(
          visitor.final_position[0],
          0,
          visitor.final_position[1]
        );

        updateCustomerPosition({
          id: customerId,
          position: {
            x: finalPosition.x,
            y: finalPosition.y,
            z: finalPosition.z,
          },
        });

        return;
      }

      const currentPoint = pathPoints[animState.currentPathIndex];
      const nextPoint = pathPoints[animState.currentPathIndex + 1];

      const from = tempVectors.position.set(
        currentPoint.x,
        currentPoint.y,
        currentPoint.z
      );
      const to = tempVectors.target.set(nextPoint.x, nextPoint.y, nextPoint.z);

      const baseSpeed = 0.05;

      const distance = from.distanceTo(to);

      const direction = tempVectors.direction.subVectors(to, from).normalize();

      const customerPosition = {
        x: from.x + direction.x * baseSpeed * delta * 60,
        y: 0,
        z: from.z + direction.z * baseSpeed * delta * 60,
      };

      const newPosition = new THREE.Vector3(
        customerPosition.x,
        customerPosition.y,
        customerPosition.z
      );
      if (newPosition.distanceTo(to) < 0.1) {
        animState.currentPathIndex++;

        const currentShelfIndex = animState.currentPathIndex - 1;
        if (
          currentShelfIndex >= 0 &&
          currentShelfIndex < visitor.visited_shelves.length
        ) {
          const shelfId = visitor.visited_shelves[currentShelfIndex];

          incrementInteraction(shelfId);
          recordInteraction(shelfId);
        }
      }

      updateCustomerPosition({
        id: customerId,
        position: customerPosition,
      });
    });
  });

  return (
    <>
      {visitors.map((visitor) => (
        <group key={visitor.id}>
          {/* Компонент покупателя */}
          <Customer
            customer={{
              id: visitor.id.toString(),
              position: {
                x: visitor.path[0][0],
                y: 0,
                z: visitor.path[0][1],
              },
              targetPosition: {
                x: visitor.final_position[0],
                y: 0,
                z: visitor.final_position[1],
              },
              targetShelfId: visitor.visited_shelves[0] || null,
              speed: 0.05,
              isTakingItem: false
            }}
          />

          {customerPathsMap.get(visitor.id.toString())?.length > 1 && (
            <primitive
              object={
                pathLinesRef.current.get(visitor.id.toString()) ||
                createPathLine(
                  visitor.id.toString(),
                  customerPathsMap.get(visitor.id.toString()) || []
                )
              }
              ref={(line) => {
                if (line) {
                  pathLinesRef.current.set(visitor.id.toString(), line);
                }
              }}
            />
          )}
        </group>
      ))}
    </>
  );
}
