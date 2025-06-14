---
lang: EN
title: Using Container Queries with Tailwind Safely in Production
date: 2025-06-15
thumbnail: /images/uploads/container_queries.avif
tags:
  - Tailwind
  - CSS
  - Progressive Enhancement
  - Tip
description: Did you know you can already use Container Queries in production today? Little catch — as long as you do it with a "Progressive Enhancement" approach! I'm going to share with you a real-world example to allow you to use container queries to build responsive typography, with progressive enhancement in mind.
summary: Did you know you can already use Container Queries in production today? Little catch — as long as you do it with a "Progressive Enhancement" approach! I'm going to share with you a real-world example to allow you to use container queries to build responsive typography, with progressive enhancement in mind.
---

## :heartpulse: What is "Progressive Enhancement"?

Think of Progressive Enhancement like building a cake: 🍰

- **Base layer**: Start with a solid, functional experience that **works for _everyone_**, no matter what browser they’re using.
- **Extra layers**: Then, if the browser supports newer features, you “enhance” the experience with those.

So in our case, you build your layout or styles to work without container queries first. Then, if the browser supports them, you layer on an extra behaviour to make things better. That way, users on older browsers still get a good experience, and users with modern browsers get an even better one. :success:

## 👉🏽 What are Container Queries?

Container Queries let you style elements based on the **_size of their container_**, not just the viewport (like media queries).

### Named containers

You may have seen that in order to use Container Queries, you need to "name" a container and then you can add a `@container` query for that container. Something like:

```css
.sidebar {
  container-name: sidemenu; /* Here you choose the name you want */
  container-type: inline-size;
}

/* Here you target a container by its name */
@container sidemenu (width > 400px) {
  /* ...styles... */
}
```

### Scroll state

Container queries have another unique use-case which is to trigger the scroll-state of an element:

- Check if it's scrollable
- Checking by how much it was scrolled
- Checking its stickyness state
- Or the snap state

The syntax for `@container` is already quite extensive ([docs](https://developer.mozilla.org/en-US/docs/Web/CSS/@container)), there are multiple things you can query: Custom properties values, styles applied to an element, size, orientation, etc.

✨ But there is a **ANOTHER WAY** to use "container queries", which is what we will cover: you can use a "query container" and **Container query length units**!

## 👉🏽 How can I use Container Queries with Tailwind (v3)—TODAY—WITHOUT PLUGINS—SAFELY IN PRODUCTION? 💥

You can start using them in Tailwind **without any extra plugin**.

If you don't plan to use `@container` or "named containers", I'll give you a real example of how to use them!

### Step 1️⃣: Mark an element as a container

You do this by applying a CSS property like `container-type: inline-size` to an element ([`container-type` docs](https://developer.mozilla.org/en-US/docs/Web/CSS/container-type)).

In Tailwind, you can use custom CSS properties by using an [arbitrary property](https://v3.tailwindcss.com/docs/adding-custom-styles#arbitrary-properties):

```html
<div class="[container-type:inline-size]">
  <!-- content -->
</div>
```

This tells the browser, "Hey, this element can be used for container-based styling."

😌 That's all you need to mark it as a **query container**.

### Step 2️⃣: Use Container Query Length Units, like `cqw`, `cqh`, `cqi`, and `cqb`

Once an element is marked as a container, you can use special units like `cqi` (Container Query Inline), which are like `% of the container's` width, height, etc. Read [the docs for container query units](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#container_query_length_units).

Here's a full example that uses **fluid typography**:

```html
<div class="[container-type:inline-size]">
  <p
    class="supports-[not(container-type:size)]:text-[1rem] md:supports-[not(container-type:size)]:text-[2rem] text-[clamp(1rem,5cqi,2rem)]"
  >
    some text
  </p>
</div>
```

(Note: you can also use another dynamic value for the font-size in the fallback option, but I wanted to keep the example simple.)

Let’s break that down:

- `text-[clamp(1rem,5cqi,2rem)]`: This sets the text size to:
  - Minimum: `1rem`
  - Ideal: `5cqi` (5% of the container’s width)
  - Maximum: `2rem`
- `supports-[not(container-type:size)]:text-[1rem]`: This is the **fallback**. If the browser doesn’t support container queries, we fall back to a fixed size by default
- `md:supports-[not(container-type:size)]:text-[2rem]`: and another size in the `md:` viewport size, so we can have a different size for larger screens.

---

That's it!

This way, you can use container queries to create responsive typography that adapts to the size of its container, while still providing a solid fallback for older browsers.

Yes, it’s a little "advanced" — but this is a real-world example. Enjoy the flexibility of plugging into modern CSS features while keeping your site accessible to all users. ✨
