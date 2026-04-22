using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server_personal_tracking.API.Middlewares;
using server_personal_tracking.Application.Interfaces;
using server_personal_tracking.Infrastructure;
using server_personal_tracking.Infrastructure.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("server_personal_tracking.API")
        ));
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.Lax; 
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
});
builder.Services.AddScoped<IUserService, UserServices>();
builder.Services.AddScoped<IFinanceService, FinanceService>();
builder.Services.AddScoped<IOcrService, TesseracOcrService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendWithCookies", policy =>
    {
        policy.WithOrigins("http://35.221.169.135:8081")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials()
               .SetIsOriginAllowedToAllowWildcardSubdomains();
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"])),
            ValidateIssuer = false,
            ValidateAudience = false
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies["jwt"];
                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        logger.LogInformation("กำลังตรวจสอบการเชื่อมต่อ Database...");

        if (await context.Database.CanConnectAsync())
        {
            logger.LogInformation("✅ เชื่อมต่อ SQL Server สำเร็จพร้อมใช้งาน!");
        }
        else
        {
            logger.LogWarning("❌ ไม่สามารถเชื่อมต่อ SQL Server ได้ (แต่ไม่มี Error โยนออกมา)");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "❌ เกิดข้อผิดพลาดร้ายแรงตอนพยายามเชื่อมต่อ Database เช็ค Connection String หรือ Docker ด่วน!");
    }
}

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowFrontendWithCookies");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();