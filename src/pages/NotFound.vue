<template>
  <div class="flex flex-col items-center space-y-4 justify-center w-full h-screen">
    <h1 class="text-center text-[10rem] font-bold leading-[.75]">404</h1>
    <h3 class="text-center text-2xl font-semibold capitalize">not found</h3>
    
    <RouterLink :to="{ name: 'home' }" class="capitalize">
      <i class="mdi mdi-home"></i> <span>go home</span>
    </RouterLink>
  </div>
</template>