# 🎯 EventSphere — Event Management System

Proyek Ujian Akhir Semester: Sistem Manajemen Event berbasis Full-Stack TypeScript

---

## 📌 Teknologi

| Layer    | Teknologi                                         |
|----------|---------------------------------------------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand |
| Backend  | Express.js, TypeScript, Prisma ORM                |
| Database | PostgreSQL                                        |
| Deploy   | Vercel (Frontend) + Render (Backend)              |

---

## 🗂 Struktur Proyek

```
event-management/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Schema database (3 tabel)
│   │   └── seed.ts             # Data awal (seed)
│   └── src/
│       ├── config/
│       │   └── database.ts     # Prisma Client singleton
│       ├── controllers/
│       │   ├── categoryController.ts
│       │   ├── speakerController.ts
│       │   └── eventController.ts
│       ├── middleware/
│       │   └── errorHandler.ts
│       ├── routes/
│       │   ├── categoryRoutes.ts
│       │   ├── speakerRoutes.ts
│       │   └── eventRoutes.ts
│       └── server.ts           # Entry point Express
│
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/
        │   │   ├── Sidebar.tsx
        │   │   └── DashboardLayout.tsx
        │   ├── ui/
        │   │   ├── Modal.tsx
        │   │   ├── ConfirmDelete.tsx
        │   │   ├── EmptyState.tsx
        │   │   └── PageHeader.tsx
        │   └── ProtectedRoute.tsx
        ├── lib/
        │   └── api.ts           # HTTP client
        ├── pages/
        │   ├── LoginPage.tsx
        │   ├── DashboardPage.tsx
        │   ├── CategoriesPage.tsx
        │   ├── SpeakersPage.tsx
        │   ├── EventsPage.tsx
        │   └── BiodataPage.tsx
        ├── store/
        │   └── authStore.ts     # Zustand auth store
        ├── types/
        │   └── index.ts         # TypeScript interfaces
        ├── App.tsx
        └── main.tsx
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js >= 18
- PostgreSQL (lokal atau cloud seperti Neon, Supabase, Railway)

---

### 1. Clone & Setup

```bash
git clone <repo-url>
cd event-management
```

### 2. Backend

```bash
cd backend

# Install dependencies
npm install

# Salin .env dan isi DATABASE_URL
cp .env.example .env
# Edit .env: DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# Sinkronisasi schema ke database
npx prisma db push

# (Opsional) Generate Prisma Client
npx prisma generate

# (Opsional) Isi data awal
npm run db:seed

# Jalankan development server
npm run dev
# → http://localhost:5000
```

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Salin .env
cp .env.example .env
# Isi VITE_API_URL=http://localhost:5000/api

# Jalankan dev server
npm run dev
# → http://localhost:5173
```

---

## 🔐 Login Demo

| Field    | Value          |
|----------|----------------|
| NIM      | `2241720001`   |
| Password | `password123`  |

> Ubah kredensial di `frontend/src/store/authStore.ts` sesuai kebutuhan.

---

## 📡 API Endpoints

### Kategori (12 endpoint total)
| Method | Endpoint              | Deskripsi        |
|--------|-----------------------|------------------|
| GET    | /api/categories       | Semua kategori   |
| GET    | /api/categories/:id   | Detail kategori  |
| POST   | /api/categories       | Buat kategori    |
| PUT    | /api/categories/:id   | Edit kategori    |
| DELETE | /api/categories/:id   | Hapus kategori   |

### Pembicara
| Method | Endpoint           | Deskripsi       |
|--------|--------------------|-----------------|
| GET    | /api/speakers      | Semua pembicara |
| GET    | /api/speakers/:id  | Detail          |
| POST   | /api/speakers      | Tambah          |
| PUT    | /api/speakers/:id  | Edit            |
| DELETE | /api/speakers/:id  | Hapus           |

### Event
| Method | Endpoint        | Deskripsi    |
|--------|-----------------|--------------|
| GET    | /api/events     | Semua event  |
| GET    | /api/events/:id | Detail event |
| POST   | /api/events     | Buat event   |
| PUT    | /api/events/:id | Edit event   |
| DELETE | /api/events/:id | Hapus event  |

---

## ☁️ Deploy

### Frontend → Vercel
1. Push repo ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set Root Directory: `frontend`
4. Add environment variable: `VITE_API_URL=https://your-api.onrender.com/api`

### Backend → Render
1. Push repo ke GitHub
2. Create Web Service di [render.com](https://render.com)
3. Set Root Directory: `backend`
4. Build Command: `npm install && npx prisma generate && npm run build`
5. Start Command: `npx prisma db push && node dist/server.js`
6. Add environment variables: `DATABASE_URL`, `FRONTEND_URL`, `NODE_ENV=production`

---

## 🎓 Informasi

- **Proyek**: Ujian Akhir Semester
- **Mata Kuliah**: Pemrograman Web Lanjut
- **Program Studi**: D-4 Teknik Informatika
