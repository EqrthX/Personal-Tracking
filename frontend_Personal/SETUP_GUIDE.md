# 🚀 Setup Guide - Personal Tracking Frontend

## ✅ สิ่งที่ได้สร้างแล้ว

### 📦 Components & Pages
- ✅ **LoginPage** - หน้าเข้าสู่ระบบ
- ✅ **RegisterPage** - หน้าสมัครสมาชิก
- ✅ **ThemeToggle** - ปุ่มสลับ Dark/Light Mode
- ✅ **ResponseModal** - Modal สำหรับแสดงผล response

### 🎨 Features
- ✅ Theme Toggle (Dark/Light Mode) พร้อม localStorage persistence
- ✅ Color Scheme: สีเขียว + สีขาว (Tailwind CSS)
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Response Modal (Success, Error, Info) - ไม่ใช้ alert
- ✅ Form Validation
- ✅ API Integration Ready

### 🗂️ Project Structure
```
src/
├── components/      # UI Components (ThemeToggle, ResponseModal)
├── contexts/        # React Context (ThemeContext)
├── hooks/          # Custom Hooks (useResponseModal)
├── pages/          # Page Components (LoginPage, RegisterPage)
├── utils/          # API Utilities & Helpers
├── App.tsx         # Main App Component
├── index.css       # Tailwind CSS Styles
└── main.tsx        # Entry Point
```

---

## 🎯 Quick Start

### 1. **Install Dependencies** (ถ้ายังไม่ได้ลง)
```bash
npm install
```

### 2. **Setup Environment Variables**
สร้างไฟล์ `.env` ในโฟลเดอร์ root:
```env
VITE_API_URL=http://localhost:3000
```

### 3. **Run Development Server**
```bash
npm run dev
```

---

## 🔐 Backend Integration (Important!)

### ⚠️ JWT Token from HTTP-Only Cookie

Backend ต้อง **ส่ง JWT เป็น HTTP-Only Cookie**:

```csharp
// C# Backend Example
var cookieOptions = new CookieOptions
{
    HttpOnly = true,      // ✓ Cannot read from JS
    Secure = true,        // ✓ HTTPS only
    SameSite = SameSiteMode.Strict,  // ✓ CSRF protection
    Expires = DateTime.UtcNow.AddDays(1),
};

Response.Cookies.Append("jwt", token, cookieOptions);
return Ok(new { Message = "เข้าสู่ระบบสำเร็จ" });
```

### ✅ Frontend จะ Handle 2 Cases:

**Case 1:** Backend ส่ง JWT ในทั้ง cookie + response body
```json
{
  "jwt": "eyJhbGci...",
  "message": "เข้าสู่ระบบสำเร็จ"
}
```
→ Frontend บันทึก JWT + mark authenticated ✓

**Case 2:** Backend ส่ง JWT เฉพาะใน HTTP-Only Cookie
```json
{
  "message": "เข้าสู่ระบบสำเร็จ"
}
```
→ Frontend mark authenticated + browser auto-send cookie ✓

**Frontend code** (LoginPage.tsx):
```tsx
if (response.data?.jwt) {
  setJWTToken(response.data.jwt);  // Case 1
} else {
  setJWTToken('COOKIE_AUTH');      // Case 2
}
```

### 🌐 API Endpoints Required:

```
[POST] /api/auth/login
  Body: { email, password }
  Response: { jwt?, message }
  Cookies: Set-Cookie: jwt=...

[POST] /api/auth/register
  Body: { email, password, name? }
  Response: { message }

[POST] /api/auth/logout
  Response: { message }
  Cookies: Clear jwt cookie

[GET] /api/user/profile
  Headers: Authorization: Bearer <jwt> (or cookie auto-sent)
  Response: { id, email, name }
```

### 🔁 Cookie Flow:

```
1. User Login
   ↓
2. Backend verifies → sends Set-Cookie: jwt=...
   ↓
3. Browser stores HTTP-Only cookie
   ↓
4. Frontend marks authenticated
   ↓
5. All future requests → Browser auto-includes cookie
   ↓
6. Backend extracts from Request.Cookies["jwt"]
```

---

### 4. **Build for Production**
```bash
npm run build
```

---

## 📱 Pages

### Login Page (`/login`)
```
- Email input
- Password input
- Remember me checkbox
- Forgot password link
- Social login (Google, Facebook placeholder)
- Link ไปหน้า Register
```

### Register Page (`/register`)
```
- First name input
- Last name input
- Email input
- Password input (6+ chars validation)
- Confirm password
- Terms & conditions checkbox
- Social register buttons
- Link ไปหน้า Login
```

---

## 🎨 Theme System

### Dark Mode Toggle
- ทำงานได้แบบ automatic (detect system preference)
- Saves preference in localStorage
- Smooth transition ระหว่าง themes

### Color Palette
**Light Mode:**
- Primary: `#10B981` (Green)
- Background: `#FFFFFF` (White)
- Text: `#111827` (Near Black)

**Dark Mode:**
- Primary: `#059669` (Dark Green)
- Background: `#111827` (Dark Gray)
- Text: `#F3F4F6` (Light Gray)

---

## 📡 API Integration

### Default API Structure

**Login Endpoint:**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "data": { ... },
  "message": "Login successful"
}

Response (Error):
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Register Endpoint:**
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (Success/Error - same structure as login)
```

### Using API Utils

```tsx
import { login, register } from './utils/api';

// Login
const loginResult = await login('user@email.com', 'password');
if (loginResult.success) {
  console.log('Logged in!');
} else {
  console.error(loginResult.error);
}

// Register
const registerResult = await register('John', 'Doe', 'john@email.com', 'pass123');
if (registerResult.success) {
  console.log('Registered!');
}
```

---

## 🔧 Customization

### เปลี่ยน Colors
แก้ไข `tailwind.config.js`:
```js
colors: {
  primary: {
    light: '#YourColor1',
    dark: '#YourColor2',
  }
}
```

### เปลี่ยน Modal Text
แก้ไข `LoginPage.tsx` หรือ `RegisterPage.tsx` และเปลี่ยนค่า:
- `title` - ชื่อเรื่อง
- `message` - ข้อความ

### เพิ่ม Fields ใหม่
1. เพิ่ม state ใน component
2. เพิ่ม input field ใน JSX
3. Update API call

---

## 📋 Modal Examples

### Success Modal
```tsx
setModal({
  isOpen: true,
  title: 'สำเร็จ',
  message: 'Operation completed successfully',
  type: 'success',
});
```

### Error Modal
```tsx
setModal({
  isOpen: true,
  title: 'ข้อผิดพลาด',
  message: 'Something went wrong',
  type: 'error',
});
```

### Info Modal
```tsx
setModal({
  isOpen: true,
  title: 'ข้อมูล',
  message: 'Please check your email',
  type: 'info',
});
```

---

## 🧪 Testing

### Test Login
1. Go to `http://localhost:5173`
2. Enter email and password
3. Click Login button
4. Modal should appear with response

### Test Theme Toggle
1. Click the theme toggle button (moon/sun icon)
2. Theme should switch between dark and light
3. Refresh page - theme should persist

### Test Form Validation
- Try registering with password < 6 chars
- Try registering with mismatched passwords
- Modal should show error message

---

## 📚 Documentation

ดู `COMPONENTS_GUIDE.md` สำหรับ detailed documentation เกี่ยวกับ:
- Component props
- Hook usage
- API utilities
- Theme context

---

## 🐛 Troubleshooting

### Theme not persisting
- Check browser localStorage (DevTools > Application > Storage)
- Ensure `ThemeProvider` wraps your app

### API calls not working
- Check VITE_API_URL in `.env`
- Verify backend is running at the correct URL
- Check browser console for errors

### Modal not showing
- Ensure `ResponseModal` component is included in your page
- Check that `isOpen` state is true
- Verify modal props are passed correctly

---

## 📞 Next Steps

1. **Connect to real backend** - Update API endpoints in `utils/api.ts`
2. **Add authentication state** - Use Context or State Management
3. **Add routing** - Use React Router for page navigation
4. **Add more pages** - Follow the same pattern for other pages
5. **Add validation** - Add form validation library if needed

---

**Happy Coding! 🚀**
