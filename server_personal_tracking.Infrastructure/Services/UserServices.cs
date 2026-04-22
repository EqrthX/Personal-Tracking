using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using server_personal_tracking.Application.DTOs.User;
using server_personal_tracking.Application.Exceptions;
using server_personal_tracking.Application.Interfaces;
using server_personal_tracking.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;


namespace server_personal_tracking.Infrastructure.Services
{
    public class UserServices : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        public UserServices(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<UserResponseDto> RegisterAsync(UserCreateDto userDto)
        {
            bool isEmailExist = _context.Users.Any(u => u.Email == userDto.Email);
            if (isEmailExist)
            {
                throw new AppException("อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น", 400);
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            if (!Enum.IsDefined(typeof(RoleUser), userDto.Role))
            {
                throw new AppException("บทบาทผู้ใช้ไม่ถูกต้อง กรุณาเลือกบทบาทที่ถูกต้อง", 400);
            }

            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = passwordHash,
                IsActive = true,
                Role = userDto.Role,
                CreatedDate = DateTime.UtcNow,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role.ToString(),
            };
        }

        public async Task<string> LoginAsync(UserLoginDto userLoginDto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == userLoginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.Password))
            {
                throw new AppException("อีเมลหรือรหัสผ่านไม่ถูกต้อง", 400);
            }

            var tokenHandler = new JwtSecurityTokenHandler();

            var keyString = _config["JwtSettings:SecretKey"] ?? throw new Exception("ไม่พบคีย์ลับสำหรับการสร้างโทเค็น");
            var key = System.Text.Encoding.ASCII.GetBytes(keyString);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                    new Claim("name", user.Name)
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
