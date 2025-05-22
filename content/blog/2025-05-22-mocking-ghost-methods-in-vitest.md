---
lang: EN
title: Mocking Ghost Methods in Vitest
date: 2025-05-22
thumbnail: /images/uploads/GhostVitest.avif
tags:
  - TypeScript
  - Vitest
  - Testing
description: Mocking "ghost" methods in Vitest is hack I discovered while mocking with Vitest. It allows you to create virtual methods for testing purposes. This article explores how to implement this concept effectively.
summary: Mocking "ghost" methods in Vitest is hack I discovered while mocking with Vitest. It allows you to create virtual methods for testing purposes. This article explores how to implement this concept effectively.
---

Vitest's powerful mocking system even lets you mock _non-existent_ exports —we'll call these "_ghost methods._" In other words, you can tell Vitest to pretend that a module has additional functions that don't really exist in the original source. This trick, using `vi.mock(path, factory)`, can be handy for modifying internal state or forcing code paths that are otherwise hard to reach.

Below we'll explore how it works, with examples and explain its caveats.

## Mocking a Ghost Method: Minimal Example

Suppose you have a module `@some/lib` that exports a function `add(x)` but no way to reset its internal total. You can mock a ghost method like `__setTotal()` by writing a mock factory. For example:

```ts
import { add } from '@some/lib'

// Before tests: mock the entire module with a factory
vi.mock('@some/lib', () => {
  // Internal state within the mock
  let total = 0
  return {
    // Override or reimplement existing exports
    add: (x: number) => {
      total += x
      return total
    },
    // *** Ghost method *** (did not exist in original module)
    __setTotal: (val: number) => {
      total = val
    },
  }
})

// In tests we can now import the ghost method:
import { add, __setTotal } from '@some/lib'

test('drives internal total via ghost method', () => {
  __setTotal(10) // use the ghost method to set state
  expect(add(5)).toBe(15) // test behavior after manipulating state
})
```

In this example, the mock factory (passed to `vi.mock`) returns an object with the original add function _and_ a new `__setTotal` function. Vitest will use this object as the module when tests run.

The "ghost" method `__setTotal` doesn't exist in the real `@some/lib`, but we can still import and call it in our tests. As Vitest's docs show, a mock factory can override or extend module exports at will <sup>1</sup>.

## How It Works Under the Hood

Vitest's `vi.mock(moduleName, factory)` is hoisted to the top of the test file, so it takes effect before any imports.

The factory can return any object, letting you define arbitrary exports. In our
example, we captured a `total` variable in the factory closure and exposed `__setTotal` to manipulate it. When the test does `import { __setTotal }`, it sees the mocked module, not the real one.

If you want to combine the real implementation with "ghost" methods, you can use Vitest's `vi.importActual` or the mock param `importOriginal` in the factory. For instance:

```ts
vi.mock('@some/lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@some/lib')>()
  let secret = 0

  return {
    ...actual, // keep original exports
    __setSecret: (val: number) => {
      // but add a mocked ghost function
      secret = val
    },
  }
})
```

This way, you preserve real behavior for existing functions (via `...actual`) and only inject the ghost.

But note: Vitest warns that mock factories are hoisted and must not use external variables. If you need to use variables from the test scope inside the mock, you'd have to use `vi.doMock` (which is not hoisted).

## Why Use Ghost Methods?

- **Drive Internal State**: Some modules have hidden state or flags that you can't easily set from the public API. A ghost method lets you force that state in a test. In our example, we directly set total to test different scenarios. In a real module you might do this to simulate retries, caches, or hidden counters.

- **Trigger Rare Code Paths or Change Private Behaviour**: If a module only follows a certain branch under special conditions, you can fake those conditions. For example, suppose a VueUse composable has an internal `isFocusLocked` flag or listens to browser events. By mocking a ghost method, you could simulate an internal change and test how the composable responds. (For instance, imagine a VueUse `useModal` hook with a private `closeAll()` function – you could add `__setLocked(true)` to test the "locked" branch.)

- **Isolate Dependencies**: In complex systems, you might not be able to easily trigger some logic without heavyweight setup. Ghost methods let you "teleport" the module into a state you want, without relying on external side effects.

Use cases often involve testing self-contained utilities or composables. For example, you might test a library event in isolation by mocking a ghost that simulates a (DOM) event or a global change. This can make your unit tests simpler and faster than spinning up a full environment.

## Caveats and When Not to Use This

In general, mocking sucks. It's a powerful tool, but it can lead to fragile tests and design smells. Here are some caveats to consider:

- **Architectural Smell**: As Vitest's guide cautions, mocking in this deep way can indicate that your code is hard to test. Introducing ghost methods breaks encapsulation, so if you find yourself needing lots of ghost setters/getters, consider refactoring. Exposing test-only methods in code under test is often preferable via dependency injection or other patterns, rather than mocking them.

- **Test Fragility**: Ghost methods are not part of the real API. Tests relying on them might pass while real usage fails. If the module's implementation changes (renaming internals, removing flags, etc.), your ghosts will silently break. Use them sparingly and document their purpose clearly.

- **TypeScript Issues**: TypeScript will complain that the ghost export doesn't exist. You can work around this by augmenting the module's type definitions in a `*.d.ts` file (e.g. `declare module '@some/lib' { export function __setTotal(val: number): void })`, or by using `// @ts-ignore` on the import. Just remember that you're intentionally bypassing type safety.

- **Hoisting Behavior**: Remember that `vi.mock()` calls are hoisted to the top of the file. This means you must call `vi.mock` before any other code in the test, and you cannot use local variables from the test file inside the mock factory (they won't exist yet). If you need dynamic behavior, consider `vi.doMock` in individual it blocks instead.

- **Global Mocks**: Mocks apply to the entire test file (or suite if done in a setup). If multiple tests need different ghost behavior, be careful to reset or re-mock appropriately (e.g. using `vi.clearAllMocks()` or separate `describe` blocks).

In summary, mocking ghost methods can be a powerful hack for unit testing tough scenarios, but, as any hack, use it carefully. It's a technique best reserved for truly internal state that you couldn't otherwise reach, not for normal control flow.

## VueUse Example (Conceptual)

As a concrete (super-simplified) example, imagine a VueUse composable that tracks online status:

```ts
// vueuse-like useNetwork.ts (simplified)
letlistener: () =>void

export functionisOnline() {
  const state= ref<boolean>(navigator.onLine)

  if (!listener) {
    listener = () => { state.value = navigator.onLine}
    window.addEventListener('online', listener)
    window.addEventListener('offline', listener)
  }

  return state
}
```

We might want to test how our code reacts when the network goes offline. The composable itself doesn't expose a way to fake an offline event. Using a ghost method, we could do:

```ts
vi.mock('@vueuse/core', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@vueuse/core')>()
  let online = true
  return {
    ...mod,
    // ghost: simulate toggling online/offline
    __setNetworkStatus: (flag: boolean) => {
      online = flag
    },
    isOnline: () => {
      // override isOnline to use our fake status
      return ref<boolean>(online)
    },
  }
})

import { isOnline, __setNetworkStatus } from '@vueuse/core'

test('handles offline status via ghost', () => {
  __setNetworkStatus(false)
  expect(isOnline().value).toBe(false)
})
```

In this contrived example, `__setNetworkStatus` is a "ghost" that lets us pretend the browser went offline. We override `isOnline` to return a ref based on our fake flag. This kind of pattern can help when testing components or hooks that depend on environment conditions.

> Note: This VueUse example is illustrative. In real tests you might stub `window.navigator.onLine` or use `vi.stubGlobal`, but it shows the idea of adding a ghost method to a third-party hook to simulate internal behavior.

## Conclusion

Vitest's `vi.mock(factory)` can do more than override existing exports – it can create _virtual_ or "ghost" methods for testing. By adding fake functions or flags to a mocked module, you can steer internal state and hit edge-case branches in your code. This technique can make unit tests easier in some scenarios (like complex VueUse composables or stateful utilities). However, be cautious: relying on ghost methods, or mocks in general, means bypassing the real module API, which can mask design issues and break after upgrading the libraries. Always weigh whether refactoring or a different testing approach might be cleaner. When used thoughtfully, ghost methods in Vitest are a clever tool in your testing toolkit.

**References:**

Vitest's official docs and guides demonstrate using mock factories to override or extend exports<sup>1</sup>, and caution that heavy mocking can indicate code structure problems <sup>1</sup>.

<sup>1</sup> Mocking Guide Vitest
https://vitest.dev/guide/mocking
