using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // 🚨 เพิ่มตัวนี้สำหรับ AllowAnonymous
using server_personal_tracking.Application.DTOs.User;
using server_personal_tracking.Application.Exceptions;
using server_personal_tracking.Application.Interfaces;

namespace server_personal_tracking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto userDto)
        {
            if (!ModelState.IsValid)
            {
                throw new AppException("ไม่เจอข้อมูล", 400);
            }
            var createdUser = await _userService.RegisterAsync(userDto);
            if (createdUser == null)
            {
                throw new AppException("การลงทะเบียนผู้ใช้ล้มเหลว", 400);
            }
            return CreatedAtAction(nameof(CreateUser), new { id = createdUser.Id }, createdUser);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            if (!ModelState.IsValid)
            {
                throw new AppException("ไม่เจอข้อมูล", 400);
            }
            var token = await _userService.LoginAsync(userLoginDto);
            if (token == null)
            {
                throw new AppException("อีเมลหรือรหัสผ่านไม่ถูกต้อง", 401);
            }

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,             // ✅ เปลี่ยนเป็น false เพราะรันบน HTTP (ไม่มี S)
                SameSite = SameSiteMode.Lax, // ✅ เปลี่ยนเป็น Lax เพื่อให้ข้ามพอร์ต 8081 ไป 3000 ได้
                Expires = DateTime.UtcNow.AddDays(1),
            };

            Response.Cookies.Append("jwt", token, cookieOptions);
            return Ok(new { Message = "เข้าสู่ระบบสำเร็จ", jwt = token });
        }
    }
}