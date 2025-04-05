"use client"

import { forwardRef } from "react"
import type { Shelf as ShelfModel, ShelfSize } from "@/entities/shelves/model/shelves-slice"
import { Box, Text, Sphere } from "@react-three/drei"
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch"
import { incrementInteraction } from "@/entities/shelves/model/shelves-slice"
import { recordInteraction } from "@/entities/analytics/model/analytics-slice"
import type * as THREE from "three"
import { useMemo } from "react"
import { shelfColors, shelfSizes, productColorPalettes } from "../constants/shelf"
interface ShelfProps {
  shelf: ShelfModel
  isSelected: boolean
  onClick: () => void
}

export const Shelf = forwardRef<THREE.Group, ShelfProps>(({ shelf, isSelected, onClick }, ref) => {
  const dispatch = useAppDispatch()
  const { id, type, size } = shelf
  const [width, height, depth] = shelfSizes[size]
  const color = shelfColors[type] || "#b8b8ff"

  const products = useMemo(() => {
    const items = []
    const shelfPositions = [0.25, 0.5, 0.75]
    
    const shelfProductTypes = [
      type, 
      type === 'meat' ? 'dairy' : type, 
      type === 'meat' ? 'bakery' : type
    ]
    
    for (let i = 0; i < shelfPositions.length; i++) {
      const shelfY = -height / 2 + height * shelfPositions[i]
      const productType = shelfProductTypes[i]
      const colorPalette = productColorPalettes[productType] || productColorPalettes.general

      const productCount = Math.max(3, Math.floor(width / 0.4))

      const isSphere = i % 2 === 0
      
      for (let j = 0; j < productCount; j++) {

        const productWidth = isSphere ? 0.15 : 0.2
        const productHeight = isSphere ? 0.15 : 0.15
        const productDepth = isSphere ? 0.15 : 0.15
        
        const xPos = -width/2 + (width / (productCount + 1)) * (j + 1)
        
        const colorIndex = j % colorPalette.length
        const productColor = colorPalette[colorIndex]
        
        items.push({
          id: `${i}-${j}`,
          type: isSphere ? 'sphere' : 'box',
          position: [
            xPos,
            shelfY + 0.05,
            -depth/2 + 0.1 + (depth * 0.6 * 0.5)
          ],
          size: isSphere ? productWidth : [productWidth, productHeight, productDepth],
          color: productColor
        })
      }
    }
    
    return items
  }, [width, height, depth, type])

  const handleInteraction = () => {
    dispatch(incrementInteraction(id))
    dispatch(recordInteraction(id))
  }

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
        handleInteraction()
      }}
    >
      <Box args={[width, height, 0.05]} position={[0, 0, depth/2 - 0.025]} castShadow receiveShadow>
        <meshStandardMaterial color={color} opacity={isSelected ? 0.8 : 1} transparent={isSelected} />
      </Box>
      
      <Box args={[0.05, height, depth]} position={[-width/2 + 0.025, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </Box>
      <Box args={[0.05, height, depth]} position={[width/2 - 0.025, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </Box>

      <Box args={[width, 0.05, depth]} position={[0, height/2 - 0.025, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </Box>
      <Box args={[width, 0.05, depth]} position={[0, -height/2 + 0.025, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </Box>

      {[0.25, 0.5, 0.75].map((pos, index) => (
        <Box
          key={index}
          args={[width - 0.05, 0.05, depth - 0.05]}
          position={[0, -height / 2 + height * pos, 0]}
          castShadow
        >
          <meshStandardMaterial color="#d0d0d0" />
        </Box>
      ))}

      {products.map((product) => {
        if (product.type === 'sphere') {
          return (
            <Sphere
              key={product.id}
              args={[product.size as number, 16, 16]}
              position={product.position as [number, number, number]}
              castShadow
            >
              <meshStandardMaterial color={product.color} />
            </Sphere>
          )
        } else {
          return (
            <Box
              key={product.id}
              args={product.size as [number, number, number]}
              position={product.position as [number, number, number]}
              castShadow
            >
              <meshStandardMaterial color={product.color} />
            </Box>
          )
        }
      })}

      <Text position={[0, height / 2 + 0.2, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>

      <Text position={[0, -height / 2 - 0.2, 0]} fontSize={0.15} color="black" anchorX="center" anchorY="middle">
        {`Interactions: ${shelf.interactions}`}
      </Text>

      {isSelected && (
        <Box args={[width + 0.1, height + 0.1, depth + 0.1]}>
          <meshStandardMaterial color="#ffff00" wireframe opacity={0.5} transparent />
        </Box>
      )}
    </group>
  )
})

Shelf.displayName = "Shelf"