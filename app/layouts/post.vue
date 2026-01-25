<template>
  <div class="flex flex-col content-around min-h-screen">
    <header role="banner" class="isolate z-1">
      <main-presentation-head-nav />
    </header>
    <main class="flex-grow z-0 py-10" role="main">
      <slot />
    </main>
    <lazy-main-presentation-the-footer />
  </div>
</template>
