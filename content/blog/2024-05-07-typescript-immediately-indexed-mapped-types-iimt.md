---
lang: EN
title: Typescript's Immediately Indexed Mapped Type (IIMT)
date: 2024-05-07
thumbnail: /images/uploads/Immediately.png
tags:
  - TypeScript
description: Let's explore what "Immediately Indexed Mapped Type (IIMT)", the concept coined by Matt Pocock, means. To understand IIMT, we need to understand the underlying concepts first.
summary: Let's explore what "Immediately Indexed Mapped Type (IIMT)", the concept coined by Matt Pocock, means. To understand IIMT, we need to understand the underlying concepts first.
---

The concept "Immediately Indexed Mapped Type (IIMT)" was [coined by Matt Pocock](https://x.com/mattpocockuk/status/1660958954694877184) to describe a common pattern in Typescript.

I'm going to show you an example and hopefully will explain how it works and why it's so useful.

## Mapped types

Let's start with a simpler example. What is a [mapped type](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)? I'm sure you're already familiar with the concept of "mapping" and it will remind you of [`Array.prototype.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). It's more or less the same concept but applied to types: you use a simple type or an interface and create another one, mapping the first one (doing some kind of transformation to the original one).

Let's see an example.

```ts twoslash
type Foo = {
  bar?: string
  baz?: number
}

type FooMappedAsBoolean = {
  [K in keyof Foo]: boolean
}

// @noErrors
const FooBoolean: FooMappedAsBoolean = {}
//                       ^?

// All the properties
// in `FooBoolean`
// are now of type boolean!
```

Tap on `FooMappedAsBoolean` to hide the popover 😉. Or click on the popover.

I'll explain what's happening in this example.

We're converting all value types in `Foo` from their original type to `boolean`. This is achieved by using a **mapped type**, which transforms the value types.

Just like in `Array.prototype.map()` in JS, we iterate the original type's properties using `K in keyof ...`. You can think of `[keyof Foo]` as `Object.keys(Foo)` but in TypeScript.

## Mapped Types With Generics

We often see mapped types used with generic types (also known as "parameter types"), to make them reusable and more flexible. Let's take a look at an example:

```ts twoslash
type Foo = {
  bar?: string
  baz?: number
}

// Commonly in TypeScript we use `T` for the generic name
export type AnythingMappedAsBoolean<T> = {
  [K in keyof T]: boolean
}

// @noErrors
const FooBoolean: AnythingMappedAsBoolean<Foo> = {}
```

This example is similar to the previous one, but in this case, `AnythingMappedAsBoolean` accepts a parameter type called `T`. This means that we can use it with any type and **reuse it** for different types of objects.

You can think of generics as function parameters in JavaScript.

From here, things can get more complex. If you want to keep on exploring mapped types, I recommend starting with [the official docs](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html) and I also recommend [this chapter](https://www.totaltypescript.com/books/total-typescript-essentials/designing-your-types-in-typescript#mapped-types) in Matt Pocock's _Essentials_ book.

## What is indexing in TypeScript?

Now that we know what a basic "mapped type" is, let's break down one of the remaining long words in the title of this article: _indexing_. Indexing does in TypeScript the same thing you could think it does when we speak about a JavaScript object (or an array).

```js
// indexing in JS
const obj = {
  property: 'hello',
}

obj['property'] // -> 'hello'
// in JS you can also do:
obj.property // -> 'hello'
```

```ts twoslash
// indexing in TS
type MyType = {
  property?: string
}

// we use a reference to another type accessing properties by index
type MyCustomProperty = MyType['property']

// 💥 but you cannot do: `MyType.property`
// That kind of syntax is reserved for "namespaces"
```

We can also use this term to access Arrays ("tuples") of types:

```ts twoslash
type MyTwoTypes = [string, number]

type MySecondType = MyTwoTypes[1] // `number`
```

That's what indexing means in Typescript.

Now, let's see one of the most common indexing patterns you will see. This pattern is found with many different names. I'll use `ObjectValues`.

```ts twoslash
type ObjectValues<T> = T[keyof T]

// Example:
const obj = {
  a: 'hello',
  b: 123,
}

type MyObjectValues = ObjectValues<typeof obj>
//       ^?
```

`keyof T` gives us all the keys from a given object as a union of types. With `T[keyof T]`, we get all **the values** from a given object as a union of types.

In this case, it's an object with two properties: `a` and `b`. The type of `ObjectValues<typeof obj>` is `string | number`.

If there were duplicated types, you wouldn't get them in the resulting union, only the unique ones, as long as they are non-exclusionary. For example:

```ts twoslash
type test = string | unknown
//    ^?
```

## Immediately Indexed Mapped Types (IIMTs)

Now that we know what "indexing" means, how to map types, and also how to do it with generics, we can finally build an "Immediately Indexed Mapped Type (IIMT)".

Let's use a real-world example I came across in a Vue.js codebase:

```ts
// I had to disable `twoslash` in this snippet because it was failing.
// But there is a link to the playground right below.

/**
 * Take only the props that are mandatory from a Component
 * As a union of strings (props names)
 */
type MandatoryProps<ComponentProps> = {
  [Prop in keyof ComponentProps]-?: {} extends Pick<ComponentProps, Prop> ? never : Prop
}[keyof ComponentProps]

// Example
interface MyComponentProps {
  disabled?: boolean
  label: string
  id: string
  onClick?: () => void
}

type MyComponentMandatoryProps = MandatoryProps<MyComponentProps>
// it should give us: `'label' | 'id'`, a union of strings
```

- Demo: [TS Playground link](https://www.typescriptlang.org/play/?ts=5.5.3#code/PQKhCgAIUyBUCGBrAppA9gOwDYE9IAuAFmgA4BO6pAzoUQgZAuWgLYKYAmD65+AZpVZNIAYXStSWFJgJQQwcAVyk0AWQ7cCvXAAVKNADzjJ02fqrUAfJAC8kAN5RYkANoXSkAJaZIqXOj8YhJSmDIEHtQAugC0APwAXI4AvpAoAB4EMpy0ul4AxkjGIWYRBtQANJAeNnGQYQBuKOSQSR7gya7+gcGmYeblUQDc4ODAwJAAoukIktgo4D5Z5PwI+eq4JqHhkY7OsJxe1AgARvOciZAn6OjzHPuQ2Kco2EnUBOQ+AOYPXpxvH2+DywomwBSQlwAFABKOw2BroP4dUbKVSQNSbEr9AgaLg8Pi7ey4rQ6SKGDFbUqRKwjcYuWAAPTioyAA)

## Explanation

That's a complex type! I think it deserves to be broken down.

### Matching optional and required props

I think it has 2 brilliant pieces that are worth discussing.

- The `-?` part makes all properties mandatory, which is important later to match with the `{} extends Pick<ComponentProps, Prop>` part. The properties that do not match, are excluded.

- The `{} extends Pick<ComponentProps, Prop>` part is a reversed condition, we use `Prop` (which represents each property but is made mandatory) to check if it matches the properties in the original `ComponentProps`. If not, then it's excluded in the final result.

The meat of this type is that we cannot match (with `extends`) two types using one property to compare them if the property is mandatory in one type but optional in the other.

```ts twoslash
type OptionalProps = {
  example?: string
}

type MandatoryProps = {
  example: string
}

type CanTheyBeExtended = OptionalProps extends MandatoryProps ? true : false
//    ^?
```

If you apply that to all the keys in a type, using `keyof T`, then it's possible to exclude properties from one type if they are not present in another.

```ts twoslash
// Let's use the same example
interface MyComponentProps {
  disabled?: boolean
  label: string
  id: string
  onClick?: () => void
}

// Let's focus on 1 property, it was optional originally
type onClickWhenOptional = Pick<MyComponentProps, 'onClick'>
type onClickOptionalProp = onClickWhenOptional['onClick']

// Now let's make them all required
type AllRequiredProps = Required<MyComponentProps>
type onClickWhenRequired = Pick<AllRequiredProps, 'onClick'>
type onClickRequiredProp = onClickWhenRequired['onClick']

// Can we intersect them?
type test = onClickWhenOptional extends onClickWhenRequired ? true : false // false

// 💥 Therefore, the following should error!
// @ts-expect-error
type test2 = Pick<AllRequiredProps, onClickOptionalProp> // {}

// And you should not be surprised by this:
type test3 = onClickOptionalProp extends onClickRequiredProp ? true : false // false
```

Now that you know that optional properties cannot be matched with required properties, let's go back to the `{} extends Pick<ComponentProps, Prop> ? never : Prop` bit.

This means:

> Does an empty object (`{}`) matches (`extends`) the original props (`ComponentProps`) with each prop made mandatory `Prop`? If so, (`never`) discard that property (`Prop`), or else return the property key as value.

### Why `never`?

The `never` part can also be unintuitive. `never` helps us to remove one property in the resulting object in our example because `never` is removed from a union:

```ts twoslash
type test = string | never
// should be `string`
```

What we're doing on our type is to assign `never` as a value when the property is not mandatory, and later, we access the object type values matching the same keys as the object type keys.

```ts twoslash
type source = {
  a: string
  b: never
}

type test = source[keyof source]
// should be just `string`, because `string | never` is resolved as `string`
```

And that's why we assign as values in our type `never : Prop`, to later get only the matching `Prop`s.

I hope it was clear after dissecting the type in smaller parts and using similar examples.

## Conclusion

I hope you learned a couple of things from this article, I sure did while writing it! It reminded me of the importance of breaking a complex problem into smaller chunks so it can be understood better.

The next time someone talks about "Immediately Indexed Mapped Types (IIMTs)," "mapped types," or "indexing," you'll be in a unique position to truly understand what it means because you've taken the time to grasp the underlying concepts.

<!-- If you have any questions or comments about this post, please leave them in the comments below. -->

Thanks for reading and happy coding 👩🏽‍💻!
