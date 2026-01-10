// import { Stack } from "expo-router"

// export default function RootLayout() {
//   return <Stack screenOptions={{ headerShown: false }} />
// }

// import { Stack } from "expo-router"

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(auth)" />
//       <Stack.Screen name="(tabs)" />
//       <Stack.Screen name="product/[id]" />
//     </Stack>
//   )
// }

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* index refers to app/index.tsx which you created earlier */}
      <Stack.Screen name="index" /> 
      
      {/* These match your folder groups */}
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      
      {/* Matches app/product/[id].tsx */}
      <Stack.Screen name="product/[id]" />
      
      {/* If you keep checkout in the root, you must declare it here */}
      <Stack.Screen name="checkout" /> 
      <Stack.Screen name="customize"></Stack.Screen>
    </Stack>
  );
}
