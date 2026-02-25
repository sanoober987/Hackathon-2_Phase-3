---
name: frontend-skill
description: Build pages, components, layouts, and styling for modern frontend applications.
---

# Frontend Skill

## Instructions

1. **Page & Layout Design**
   - Create responsive page layouts
   - Use grid, flexbox, or CSS frameworks for structure
   - Ensure mobile-first and cross-browser compatibility
   - Organize components logically

2. **Component Development**
   - Build reusable UI components
   - Implement props, state, and event handling
   - Keep components modular and testable
   - Apply composition over duplication

3. **Styling & Visuals**
   - Apply modern styling (CSS, SCSS, Tailwind, or CSS-in-JS)
   - Use themes, variables, and consistent design tokens
   - Implement interactive elements and hover/focus states
   - Optimize for performance and accessibility

4. **Integration**
   - Connect components with backend APIs
   - Handle data fetching and state updates gracefully
   - Implement dynamic routing where needed
   - Optimize rendering and avoid unnecessary re-renders

---

## Best Practices

- Follow design system guidelines  
- Keep components reusable and modular  
- Use semantic HTML for accessibility  
- Optimize assets and images for performance  
- Maintain consistent spacing, typography, and colors  
- Test UI components for responsiveness and usability  

---

## Example Structure

```jsx
// Example React/Next.js Component
export default function Hero({ title, subtitle, cta }) {
  return (
    <section className="hero min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white">{title}</h1>
      <p className="mt-4 text-xl text-white">{subtitle}</p>
      <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded">{cta}</button>
    </section>
  );
}
