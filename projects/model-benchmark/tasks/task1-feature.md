# Task 1: Feature Addition (Dark Mode Toggle)

**Complexity:** Low  
**Time Limit:** 2 minutes  
**Type:** Feature implementation

---

## Input File

`index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple Blog</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: white;
      color: #333;
    }
    h1 { color: #2563eb; }
    article {
      border-bottom: 1px solid #ddd;
      padding: 20px 0;
    }
  </style>
</head>
<body>
  <h1>My Blog</h1>
  
  <article>
    <h2>First Post</h2>
    <p>This is my first blog post. Welcome to my site!</p>
  </article>
  
  <article>
    <h2>Second Post</h2>
    <p>Another day, another post. Technology is fascinating.</p>
  </article>
</body>
</html>
```

---

## Task

Add a **dark mode toggle button** to this page.

**Requirements:**
1. Button in top-right corner labeled "Toggle Dark Mode"
2. Clicking toggles between light and dark themes
3. Dark theme specs:
   - Background: `#1a1a1a`
   - Text color: `#e5e5e5`
   - Headings: `#60a5fa`
   - Border: `#333`
4. Preserve current light theme colors
5. Use vanilla JavaScript (no frameworks)

**Deliverable:** Complete modified `index.html` file

---

## Evaluation Criteria

- **Correctness (4 pts):** Does the toggle work? Are colors correct?
- **Code Quality (3 pts):** Clean implementation? Good variable names?
- **User Experience (3 pts):** Button placement? Smooth transition?

**Total:** /10 points
