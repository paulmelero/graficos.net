<template>
  <div class="relative p-12 dark:bg-gray-darkest">
    <MainPresentationPatternEdges :thickness="20" class="opacity-20" />

    <div>
      <h1 class="sr-only">Graficos.net</h1>
      <MainPresentationSplitSectionsHomeJumboComponentsLetters :letters class="xl:max-w-5xl mx-auto md:min-h-[30vh]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const letters = [
  {
    l: 'g',
    // ascii in dec
    a: 103,
    // order in the alphabet
    o: 7,
  },
  {
    l: 'r',
    a: 114,
    o: 18,
  },
  {
    l: 'a',
    a: 97,
    o: 1,
  },
  {
    l: 'f',
    a: 102,
    o: 6,
  },
  {
    l: 'i',
    a: 105,
    o: 9,
  },
  {
    l: 'c',
    a: 99,
    o: 3,
  },
  {
    l: 'o',
    a: 111,
    o: 15,
  },
  {
    l: 's',
    a: 115,
    o: 19,
  },
  {
    l: '.',
    a: 46,
    o: undefined,
  },
  {
    l: 'n',
    a: 110,
    o: 14,
  },
  {
    l: 'e',
    a: 101,
    o: 5,
  },
  {
    l: 't',
    a: 116,
    o: 20,
  },
] as const
</script>
