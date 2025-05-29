# 🔄 Table to Card Viewer

A responsive and reusable **Vue 3 + Nuxt 3** component that toggles between **table** and **card** views for better mobile usability.

## ✨ Features

- 🧩 **Reusable components** like `TableRow.vue` & `CardItem.vue`
- 📱 **Responsive layout** (desktop & mobile)
- 🔀 **Toggle between views** with a single switch
- 🎨 **Modular SCSS styling**
- 🌙 **Dark mode support**
- 🧭 **Status-based filtering** (Active / Inactive)
- 🔍 **Search input with clearable field**
- 🔄 **Loading spinner animation**
- ⚙️ Built with Nuxt 3
- ⚡️ **PWA-ready** with offline support & splash screen

## 🧪 Latest UI Updates

- ✅ Integrated **search input** with clear (×) button
- ✅ Added **loading spinner** for smooth transition feedback
- ✅ Wrapped all views in a single `<Transition>` to prevent flicker
- ✅ Fixed iOS horizontal scroll issue on table view
- ✅ Scrollbar color adapted for both dark & light mode

## 📦 Project Structure

- `/components` – UI building blocks (cards, rows, switch, etc.)
- `/assets/scss` – Global + modular SCSS styles
- `/pages` – View container (switcher layout)
- `/public` – PWA icons and static files
- `nuxt.config.ts` – Nuxt & PWA configuration

## 🛠 Setup

```bash
npm install
npm run dev

```

## 🚧 Coming Soon

- 📡 Dynamic data from API
- 📦 Pagination, filtering, sorting

## 👨‍💻 Author

- Created by @haloglu with ☕ & ❤️
