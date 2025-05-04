// components/Screen.tsx
import { YStack, YStackProps } from 'tamagui'

export function Screen({ children, ...props }: YStackProps) {
  return (
    <YStack
      f={1}
      bg="#141414" // or use bg="$background" if using Tamagui theme
      px="$4"
      py="$4"
      {...props}
    >
      {children}
    </YStack>
  )
}
