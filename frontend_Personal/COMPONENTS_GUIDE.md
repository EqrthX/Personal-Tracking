# Personal Tracking - Frontend UI Components

## 📋 Overview

UI Components สำหรับระบบ Personal Tracking ที่ประกอบด้วย Login, Register, Theme Toggle, และ Response Modal.

**สีหลัก:**
- 🟢 สีเขียว (Primary): `#10B981` (light), `#059669` (dark)
- ⚪ สีขาว (Accent): `#FFFFFF` (light), `#F3F4F6` (dark)

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ThemeToggle.tsx       # Theme switcher button
│   └── ResponseModal.tsx      # Modal for displaying responses
├── contexts/            # React contexts
│   └── ThemeContext.tsx       # Theme provider & hook
├── hooks/               # Custom React hooks
│   └── useResponseModal.ts    # Hook for modal management
├── pages/               # Page components
│   ├── LoginPage.tsx         # Login form page
│   └── RegisterPage.tsx       # Register form page
├── utils/               # Utility functions
│   └── api.ts               # API call utilities
├── App.tsx              # Main app component
├── index.css            # Tailwind CSS styles
└── main.tsx             # Entry point
```

---

## 🎨 Components

### 1. **ThemeToggle**
ปุ่มสลับระหว่าง Dark Mode และ Light Mode

**Usage:**
```tsx
import { ThemeToggle } from './components/ThemeToggle';

export function MyComponent() {
  return <ThemeToggle />;
}
```

### 2. **ResponseModal**
Modal สำหรับแสดงผล response จาก backend (Success, Error, Info)

**Props:**
- `isOpen: boolean` - ควบคุมการแสดง/ซ่อน modal
- `title: string` - ชื่อเรื่อง modal
- `message: string` - ข้อความที่จะแสดง
- `type: 'success' | 'error' | 'info'` - ประเภทของ modal
- `onClose: () => void` - Callback เมื่อปิด modal

**Usage:**
```tsx
import { ResponseModal } from './components/ResponseModal';
import { useState } from 'react';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Show Modal</button>
      <ResponseModal
        isOpen={isOpen}
        title="Success"
        message="Operation completed successfully"
        type="success"
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

### 3. **LoginPage**
หน้าเข้าสู่ระบบ โดยมี:
- Email input
- Password input
- Remember me checkbox
- Forgot password link
- Social login buttons (Google, Facebook)
- Link ไปหน้า Register
- Response modal สำหรับแสดงผล

### 4. **RegisterPage**
หน้าสมัครสมาชิก โดยมี:
- First name input
- Last name input
- Email input
- Password input (6+ characters)
- Confirm password input
- Terms & conditions checkbox
- Social register buttons
- Link ไปหน้า Login
- Response modal สำหรับแสดงผล

---

## 🎯 Hooks

### useResponseModal
Hook สำหรับจัดการ modal state ได้ง่าย

**Usage:**
```tsx
import { useResponseModal } from './hooks/useResponseModal';

export function MyComponent() {
  const { modal, showModal, closeModal } = useResponseModal();

  const handleAction = () => {
    showModal('Success', 'Operation completed!', 'success');
  };

  return (
    <>
      <button onClick={handleAction}>Do Something</button>
      <ResponseModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />
    </>
  );
}
```

---

## 🌐 API Utilities

### apiCall
ฟังก์ชัน generic สำหรับทำ API request

```tsx
import { apiCall } from './utils/api';

const response = await apiCall('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify({ data: 'value' })
});

if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error);
}
```

### login
ทำการเข้าสู่ระบบ

```tsx
import { login } from './utils/api';

const response = await login('user@email.com', 'password123');
```

### register
สมัครสมาชิกใหม่

```tsx
import { register } from './utils/api';

const response = await register('John', 'Doe', 'john@email.com', 'password123');
```

---

## 🎭 Theme Context

### ThemeProvider
Provider สำหรับจัดการ theme ของ application

```tsx
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';

export default function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
```

### useTheme
Hook สำหรับใช้งาน theme

```tsx
import { useTheme } from './contexts/ThemeContext';

export function MyComponent() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div>
      <span>Current mode: {isDark ? 'Dark' : 'Light'}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

---

## 🎨 Tailwind CSS Configuration

Color scheme ที่กำหนด:
```js
colors: {
  primary: {
    light: '#10B981',  // สีเขียว light
    dark: '#059669',   // สีเขียว dark
  },
  accent: {
    light: '#FFFFFF',  // สีขาว light
    dark: '#F3F4F6',   // สีขาว dark
  }
}
```

---

## 🚀 Usage Example

```tsx
import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register'>('login');

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <header className="bg-white dark:bg-gray-800 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-600">App Name</h1>
            <div className="flex items-center gap-4">
              <nav>
                <button onClick={() => setCurrentPage('login')}>Login</button>
                <button onClick={() => setCurrentPage('register')}>Register</button>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          {currentPage === 'login' ? <LoginPage /> : <RegisterPage />}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
```

---

## 📱 Responsive Design

ทั้งหมด components นี้มี responsive design ที่ทำงาน ได้ดีบน:
- 📱 Mobile (< 640px)
- 📱 Tablet (640px - 1024px)
- 🖥️ Desktop (> 1024px)

---

## 🔧 Environment Variables

สำหรับการตั้งค่า API base URL ให้สร้าง `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

ถ้าไม่ตั้งค่า จะใช้ default เป็น `http://localhost:3000`

---

## 📝 Notes

- Theme จะบันทึกไป localStorage เพื่อให้ persist หลังเรื่ย
- Modal จะแสดงประเภทต่างๆ เป็น Success (เขียว), Error (แดง), Info (ฟ้า)
- ทุก forms มี validation และจะแสดงข้อความ error ใน modal
- API calls มี built-in error handling

---

## 📦 Dependencies

- React 19+
- Tailwind CSS 4+
- React DOM 19+

---

**创建日期:** 2024
**ทำให้โดย:** GitHub Copilot
