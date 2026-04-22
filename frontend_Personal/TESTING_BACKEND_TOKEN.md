# ✅ Testing Backend Token Integration

## 🧪 Quick Test Checklist

### Step 1: Start Frontend & Backend

```bash
# Terminal 1 - Frontend
cd d:\Source\Personal_Tracking\frontend_Personal
npm run dev

# Terminal 2 - Backend
# Start your C# backend API
dotnet run
```

---

## 🔍 Test Case 1: Login with JWT in Response Body

### What to Expect:

**Backend sends:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "เข้าสู่ระบบสำเร็จ"
}
```

**Frontend will:**
1. Extract JWT from response
2. Decode user info from JWT
3. Store in localStorage
4. Show user email/name in Dashboard

### Test Steps:

1. **Open** `http://localhost:5173/login`
2. **Enter credentials** (test email & password)
3. **Click** "เข้าสู่ระบบ"
4. **Check Browser DevTools:**
   
   ```
   F12 → Network → (click login request)
   ```
   
   Should see in **Response:**
   ```json
   {
     "jwt": "eyJ...",
     "message": "เข้าสู่ระบบสำเร็จ"
   }
   ```

5. **Verify localStorage:**
   
   ```
   F12 → Application → Local Storage → localhost:5173
   ```
   
   Should see:
   - Key: `auth_token`
   - Value: (same JWT)

6. **Verify Dashboard:**
   - Should redirect to `/dashboard`
   - Should display user info (email, name, ID)

---

## 🍪 Test Case 2: Login with HTTP-Only Cookie Only

### What to Expect:

**Backend sends:**
```
Set-Cookie: jwt=eyJ...; HttpOnly; Secure; SameSite=Strict
```

**Response body:**
```json
{
  "message": "เข้าสู่ระบบสำเร็จ"
}
```
(No JWT in body)

### Test Steps:

1. **Check Network Response:**
   
   ```
   F12 → Network → (click login request)
   Response Headers: Set-Cookie header
   ```
   
   Should see:
   ```
   Set-Cookie: jwt=eyJ...; HttpOnly; Secure; SameSite=Strict
   ```

2. **Verify Browser Cookies:**
   
   ```
   F12 → Application → Cookies → localhost:5173
   ```
   
   Should see:
   - Name: `jwt`
   - HttpOnly: ✓ (checked)
   - Secure: ✓ (if HTTPS)
   - SameSite: `Strict`

3. **Verify localStorage:**
   
   ```
   F12 → Application → Local Storage → localhost:5173
   ```
   
   Should see:
   - Key: `auth_token`
   - Value: `COOKIE_AUTH` (flag)

4. **Verify Dashboard:**
   - Should redirect to `/dashboard`
   - Should say "🔒 Using HTTP-Only Cookie"
   - User info may be empty (expected)

---

## 🔐 Test Case 3: Logout

### Steps:

1. **Click** "ออกจากระบบ" button on Dashboard
2. **Should redirect** to `/login`
3. **Verify localStorage cleared:**
   
   ```
   F12 → Application → Local Storage → localhost:5173
   ```
   
   Should NOT see `auth_token`

4. **Verify cookie cleared** (optional):
   
   ```
   F12 → Application → Cookies → localhost:5173
   ```
   
   Cookie should be deleted

---

## 🧪 Test Case 4: API Calls with Cookie

### Setup:

1. Login successfully (any method)
2. Open DevTools: `F12 → Network`

### Test API Call:

1. **Make an API request** from Dashboard or create a test button
2. **Check Request Headers:**
   
   ```
   F12 → Network → (any API request)
   Request Headers: Cookie
   ```
   
   Should see:
   ```
   Cookie: jwt=eyJ...
   ```

---

## 🔍 Common Issues & Solutions

### ❌ Issue: Cookie not sent in requests

**Debug:**
```
F12 → Network → (API request) → Request Headers
```

**Expected to see:**
```
Cookie: jwt=eyJ...
```

**If not found, check:**
- ✅ Backend has `AllowCredentials()` in CORS
- ✅ Frontend has `credentials: 'include'` (already set in api.ts)
- ✅ Cookie is not HttpOnly only (we need the security)

---

### ❌ Issue: JWT not in response body

**This is expected!** If backend sends HTTP-Only cookie only:
- Frontend marks as `COOKIE_AUTH`
- Browser handles cookie automatically
- No need to manually include JWT in requests

---

### ❌ Issue: User info not showing

**If using HTTP-Only Cookie:**
- User info is empty (expected)
- Solution: Fetch from `/api/user/profile` endpoint

**To implement:**
```typescript
useEffect(() => {
  if (isAuthenticated && !user) {
    const fetchProfile = async () => {
      const res = await apiCall('/api/user/profile');
      if (res.success) {
        setUser(res.data.user);
      }
    };
    fetchProfile();
  }
}, [isAuthenticated, user]);
```

---

### ❌ Issue: Can't read cookie from console

**This is correct!** HTTP-Only cookies are intentionally hidden from JS:
```typescript
console.log(document.cookie);  // Empty (expected)
```

They're secure this way ✓

---

## ✅ Verification Checklist

| Test | Expected Result | Status |
|------|-----------------|--------|
| Login success | Redirect to /dashboard | ☐ |
| JWT in response | localStorage has token | ☐ |
| HTTP-Only cookie | Cookie in browser storage | ☐ |
| User info displayed | Name/email on dashboard | ☐ |
| API call has cookie | Network request has Cookie header | ☐ |
| Logout successful | Redirects to /login | ☐ |
| localStorage cleared | No auth_token after logout | ☐ |
| Page refresh | Stay authenticated | ☐ |

---

## 🛠️ Debug Commands (Browser Console)

```typescript
// Check auth state
import { useAuth } from './src/contexts/AuthContext';
const { isAuthenticated, user } = useAuth();
console.log({ isAuthenticated, user });

// Check token in storage
localStorage.getItem('auth_token');

// Check if authenticated
import { isAuthenticated } from './src/utils/auth';
console.log(isAuthenticated());

// Check decoded token
import { getJWTToken, decodeJWT } from './src/utils/auth';
const token = getJWTToken();
const decoded = decodeJWT(token);
console.log(decoded);

// Cannot read HTTP-Only cookie (as expected)
console.log(document.cookie);  // Empty
```

---

## 🎯 Backend Should Also Have:

```csharp
// 1. Login endpoint
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto dto)
{
    var token = _tokenService.GenerateToken(user);
    Response.Cookies.Append("jwt", token, cookieOptions);
    return Ok(new { 
        jwt = token,  // Optional: for backup
        message = "เข้าสู่ระบบสำเร็จ"
    });
}

// 2. Logout endpoint
[HttpPost("logout")]
public IActionResult Logout()
{
    Response.Cookies.Delete("jwt");
    return Ok(new { message = "ออกจากระบบสำเร็จ" });
}

// 3. CORS configured
services.AddCors(options => 
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();  // ✓ Required
    });
});
```

---

## 📋 Ready to Test!

✅ Frontend is configured and ready  
✅ Both JWT scenarios supported  
✅ Cookie handling set up  
✅ Auto-include in requests working  

**Just verify backend is sending correctly!**

---

**Happy Testing! 🚀**
