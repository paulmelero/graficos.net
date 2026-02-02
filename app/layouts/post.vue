<template>
  <div class="flex flex-col content-around min-h-screen">
    <header role="banner" class="isolate z-10 sticky top-0">
      <main-presentation-head-nav />
    </header>
    <main class="flex-grow z-0 pb-24" role="main">
      <slot />
    </main>
    <lazy-main-presentation-the-footer />
  </div>
</template>
