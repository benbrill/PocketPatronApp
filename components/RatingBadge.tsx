import Svg, { Circle } from 'react-native-svg'
import { Text, YStack } from 'tamagui'

type RatingCircleProps = {
  rating: number // 0 to 10
  size?: number  // default 80
  fontSize?: number // default 18
  strokeWidthInput?: number // default 8
}

export default function RatingCircle({ rating, size = 80, fontSize = 18, strokeWidthInput = 8 }: RatingCircleProps) {
  const strokeWidth = strokeWidthInput
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const clampedRating = Math.min(Math.max(rating, 0), 10)
  const percentage = clampedRating / 10
  const strokeDashoffset = circumference * (1 - percentage)

  // Color gradient red → yellow → green
  function getColor(rating: number): string {
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max))
    const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t)
  
    const red = { r: 255, g: 59, b: 48 }      // #ff3b30
    const yellow = { r: 248, g: 210, b: 42 }  // #f8d22a
    const green = { r: 47, g: 138, b: 68 }    // #2f8a44
  
    const t = clamp(rating, 0, 10)
  
    let from, to, localT
    if (t <= 5) {
      from = red
      to = yellow
      localT = t / 5
    } else {
      from = yellow
      to = green
      localT = (t - 5) / 5
    }
  
    const r = lerp(from.r, to.r, localT)
    const g = lerp(from.g, to.g, localT)
    const b = lerp(from.b, to.b, localT)
  
    return `rgb(${r},${g},${b})`
  }
  

  const strokeColor = getColor(rating)

  return (
    <YStack alignItems="center" justifyContent="center" width={size} height={size}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#363535"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Foreground (rating) circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      <Text
        position="absolute"
        fontSize={fontSize}
        fontWeight="bold"
        color={strokeColor}
      >
        {rating.toFixed(1)}
      </Text>
    </YStack>
  )
}
