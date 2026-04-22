# 🛣️ Routing Guide - React Router v6

## 📋 Overview

โปรเจคใช้ **React Router v6** สำหรับ navigation ระหว่าง pages ต่างๆ

## 🗺️ Route Structure

```
/                           → หน้าแรก (redirect ไป /login)
├── /login                  → หน้าเข้าสู่ระบบ
├── /register               → หน้าสมัครสมาชิก
├── /dashboard              → หน้า Dashboard (หลัก)
└── *                       → 404 Not Found
```

## 📁 Project Structure

```
src/
├── router/
│   └── index.tsx              # Router configuration
├── layouts/
│   └── RootLayout.tsx         # Parent layout with header/footer
├── components/
│   └── Navigation.tsx         # Navigation bar
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   └── NotFoundPage.tsx
└── App.tsx                    # Main app component
```

## 🔧 Configuration

### Router Setup (`src/router/index.tsx`)

```tsx
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      // ... more routes
    ],
  },
]);
```

## 📍 Navigation

### Using Link Component

```tsx
import { Link } from 'react-router-dom';

export function MyComponent() {
  return (
    <Link to="/dashboard" className="...">
      Go to Dashboard
    </Link>
  );
}
```

### Using useNavigate Hook

```tsx
import { useNavigate } from 'react-router-dom';

export function MyComponent() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return <button onClick={handleSuccess}>Continue</button>;
}
```

### Programmatic Navigation

```tsx
// ไป dashboard
navigate('/dashboard');

// ไปหน้าแล้ว replace history entry
navigate('/login', { replace: true });

// กลับไปหน้าก่อนหน้า
navigate(-1);
```

## 🎯 Current Routes

### 1. Login Route (`/login`)
- หน้าเข้าสู่ระบบ
- หลังสำเร็จ → ไป `/dashboard` (หลัง 1.5 วินาที)
- Link ไปหน้า Register

### 2. Register Route (`/register`)
- หน้าสมัครสมาชิก
- หลังสำเร็จ → ไป `/login` (หลัง 1.5 วินาที)
- Link ไปหน้า Login

### 3. Dashboard Route (`/dashboard`)
- หน้าหลักสำหรับผู้ใช้ที่ login แล้ว
- แสดง status ของ app
- ลิงค์ไปยัง Login/Register

### 4. 404 Route
- แสดงเมื่อ URL ไม่พบ
- มีปุ่มกลับไปหน้าแรก

## 🏗️ RootLayout

Layout ที่ wrap ทุก page โดยมี:

- **Header** - แสดง logo, navigation, theme toggle
- **Main** - แสดง current page content (ผ่าน Outlet)
- **Footer** - ข้อมูล copyright

```tsx
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>...</header>
      <main className="flex-1">
        <Outlet />  {/* Page content จะแสดงที่นี่ */}
      </main>
      <footer>...</footer>
    </div>
  );
}
```

## 🧭 Navigation Component

แสดง navigation links ระหว่าง pages ที่สำคัญ

```tsx
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav>
      <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
        Dashboard
      </Link>
      {/* ... more links */}
    </nav>
  );
}
```

## ➕ เพิ่ม Route ใหม่

### Step 1: สร้าง Page Component

```tsx
// src/pages/MyPage.tsx
export const MyPage = () => {
  return <div>My Page Content</div>;
};
```

### Step 2: เพิ่ม Route ใน Router

```tsx
// src/router/index.tsx
import { MyPage } from '../pages/MyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // ... existing routes
      {
        path: 'my-page',
        element: <MyPage />,
      },
    ],
  },
]);
```

### Step 3: เพิ่ม Link ใน Navigation (optional)

```tsx
<Link to="/my-page">My Page</Link>
```

## 🔐 Protected Routes (ยังไม่ใช้)

สำหรับกรณีที่ต้อง redirect ไป login ถ้ายังไม่ login:

```tsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ใช้ใน router:
{
  path: 'admin',
  element: <ProtectedRoute isAuthenticated={isAuth}><AdminPage /></ProtectedRoute>,
}
```

## 🎨 Active Link Styling

ใช้ `useLocation()` เพื่อรู้ว่า route ไหนเป็น active:

```tsx
import { useLocation } from 'react-router-dom';

export function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={isActive ? 'bg-green-600 text-white' : 'text-gray-600'}
    >
      {children}
    </Link>
  );
}
```

## 📊 Nested Routes

Routes สามารถ nested ได้:

```tsx
{
  path: 'admin',
  element: <AdminLayout />,
  children: [
    { path: 'users', element: <UsersPage /> },
    { path: 'settings', element: <SettingsPage /> },
  ],
}
```

## 🚀 Usage Example

```tsx
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { router } from './router';

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
```

---

**Happy Routing! 🛣️**
