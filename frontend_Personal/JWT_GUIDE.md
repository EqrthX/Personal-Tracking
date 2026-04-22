# 🔐 JWT Token Management Guide - HTTP-Only Cookie

## 📋 Overview

ระบบ JWT Token Management ที่รับ JWT จาก Backend เป็น **HTTP-Only Cookie**

**สำคัญ:** Backend ส่ง JWT เป็น HTTP-Only Cookie, ไม่ใช่ response body

## 🏗️ Architecture

```
Backend (API)
    ↓
    └── Response.Cookies.Append("jwt", token, cookieOptions)
        └── { Message: "เข้าสู่ระบบสำเร็จ" }  (no jwt in body)
    ↓
FrontEnd (LoginPage)
    ├── Check response.success = true
    ├── Mark isAuthenticated = true
    ├── Browser automatically stores HTTP-Only cookie
    ↓
All Future API Calls
    ├── Browser auto-includes cookie จากที่ Backend set ไว้
    ├── No need to manually add header
    ↓
Backend (API)
    ├── Extract from Request.Cookies["jwt"]
    ├── Verify JWT
    ├── Return data
```

## 🔑 โครงสร้าง Cookie

```csharp
// Backend ส่ง Cookie:
var cookieOptions = new CookieOptions
{
    HttpOnly = true,      // ✓ ไม่สามารถอ่านจาก JS
    Secure = true,        // ✓ HTTPS only
    SameSite = SameSiteMode.Strict,  // ✓ CSRF protection
    Expires = DateTime.UtcNow.AddDays(1),
};
Response.Cookies.Append("jwt", token, cookieOptions);
```

**ผลลัพธ์:**
- ✓ Cookie ถูกเก็บในระบบ
- ✓ ส่ง auto ในทุก request ไปยัง backend
- ✓ ไม่สามารถอ่านจาก JavaScript (HttpOnly)
- ✓ ปลอดภัยจาก XSS attack

## 📁 File Structure

```
src/
├── utils/
│   ├── api.ts           # API calls (credentials: 'include')
│   └── auth.ts          # JWT utilities (for optional token backup)
├── contexts/
│   └── AuthContext.tsx  # Auth state management
├── pages/
│   └── LoginPage.tsx    # Mark authenticated on login
└── App.tsx              # Wrapped with AuthProvider
```

## 🔄 Login Flow

### Step 1: User Login

```tsx
// LoginPage.tsx
const handleLogin = async (e) => {
  const response = await login(email, password);
  
  if (response.success) {
    // ✓ Mark as authenticated
    setJWTToken('COOKIE_AUTH');
    
    // Browser already has cookie from Set-Cookie header
    navigate('/dashboard');
  }
};
```

### Step 2: Backend Response

```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
{
    var token = await _userService.LoginAsync(userLoginDto);
    
    // ✓ Set HTTP-Only Cookie
    Response.Cookies.Append("jwt", token, cookieOptions);
    
    // ✓ Return success
    return Ok(new { Message = "เข้าสู่ระบบสำเร็จ" });
}
```

### Step 3: Future API Calls

```tsx
// ทุก API call ใช้ credentials: 'include'
const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',  // ✓ Include cookies
    headers: { 'Content-Type': 'application/json' }
});
```

**Browser automatically:**
- ✓ ส่ง cookie ไป backend
- ✓ ไม่ต้องทำ manually

## 🛠️ HTTP-Only Cookie vs localStorage

| Feature | HTTP-Only Cookie | localStorage |
|---------|------------------|--------------|
| อ่านจาก JS | ❌ ไม่ได้ | ✅ ได้ |
| XSS safe | ✅ ปลอดภัย | ❌ เสี่ยง |
| CSRF protection | ✅ ใช้ได้ | ❌ ต้อง extra config |
| Auto-send | ✅ auto | ❌ manual |
| Storage | Server-side | Client-side |
| **ดีที่สุด** | 🏆 **ดีที่สุด** | ⚠️ Optional backup |

## 📝 Usage

### 1. Login

```tsx
import { useAuth } from '../contexts/AuthContext';
import { login } from '../utils/api';

export const LoginPage = () => {
  const { setJWTToken } = useAuth();
  
  const handleLogin = async (e) => {
    const response = await login(email, password);
    
    if (response.success) {
      setJWTToken('COOKIE_AUTH');  // Mark authenticated
      navigate('/dashboard');
    }
  };
};
```

### 2. Check Authentication

```tsx
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <h1>Hello {user?.email}</h1>;
};
```

### 3. API Calls

```tsx
// Cookie automatically included
const response = await apiCall('/api/user/profile', {
  method: 'GET',
  // ✓ credentials: 'include' already set in apiCall()
});
```

### 4. Logout

```tsx
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  // Frontend: clear auth state
  // Backend: should clear cookie on logout endpoint
  navigate('/login');
};
```

## ⚙️ Backend Logout (Optional)

Backend ควรมี endpoint สำหรับ logout เพื่อลบ cookie:

```csharp
[HttpPost("logout")]
public IActionResult Logout()
{
    // Clear cookie
    Response.Cookies.Delete("jwt");
    
    return Ok(new { Message = "ออกจากระบบสำเร็จ" });
}
```

## 🔍 Debugging

### Check Browser Cookies

```
DevTools → Application → Cookies → localhost:5173
```

จะเห็น:
- ✓ Name: `jwt`
- ✓ HttpOnly: ✓ (checked)
- ✓ Secure: ✓ (checked)
- ✓ SameSite: Strict

### Check Network Requests

```
DevTools → Network → (API request)
```

จะเห็น:
- ✓ Request Headers: `Cookie: jwt=eyJ...`
- ✓ Response Headers: `Set-Cookie: jwt=...` (on login)

### Browser Console

```tsx
// Cannot read HTTP-Only cookie from console
console.log(document.cookie);  // empty (if HttpOnly only)

// But can check auth state
const { isAuthenticated } = useAuth();
console.log(isAuthenticated);  // true/false
```

## ✅ Checklist

- ✓ Backend sends JWT as HTTP-Only cookie
- ✓ Frontend marks authenticated on login success
- ✓ All API calls use `credentials: 'include'`
- ✓ Cookie automatically included in future requests
- ✓ Logout clears auth state
- ✓ HTTP-Only cookie is secure from XSS

## 🎯 Alternative Option (Backend sends both)

ถ้าต้องการให้ frontend ส่ง JWT ใน header บ้าง:

```csharp
// Backend: send JWT in both cookie AND body
return Ok(new { 
    jwt = token,  // ← For reference/backup
    message = "เข้าสู่ระบบสำเร็จ" 
});
```

```tsx
// Frontend: can save as backup
if (response.data?.jwt) {
  saveJWTToken(response.data.jwt);  // Optional backup
}
```

---

**📌 สรุป:** Backend ส่ง JWT เป็น HTTP-Only Cookie → Browser ส่ง auto ในทุก request → Frontend mark authenticated → ปลอดภัยและสะดวก ✅

---

**Happy Secure Authentication! 🔒**

