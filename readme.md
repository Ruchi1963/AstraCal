# 🗓️ AstraCal — High-Fidelity Google Calendar Clone

**AstraCal** is a full-stack Google Calendar clone built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.  
It provides an interactive, polished interface for creating, editing, and managing events with backend persistence and smooth user experience.

---

## 🚀 Features

- Google Calendar–like monthly, weekly, and daily views  
- Create / edit / delete events directly from the UI  
- Color-coded events and “All-Day” toggle  
- Recurring events (RRULE support)  
- Smooth modals and transitions  
- Fully responsive layout  
- Backend with Prisma + SQLite for data persistence  

---

#Install dependencies
pnpm install
# or
npm install

3️⃣ Create .env file

In the project root:

DATABASE_URL="file:./prisma/dev.db"

4️⃣ Set up the database
npx prisma generate
npx prisma migrate dev --name init


Optional — open Prisma Studio to inspect data:

npx prisma studio

5️⃣ Run the development server
pnpm dev


Visit 👉 http://localhost:5173



