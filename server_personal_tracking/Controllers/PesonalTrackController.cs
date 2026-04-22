using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server_personal_tracking.Application.DTOs.Finance;
using server_personal_tracking.Application.Exceptions;
using server_personal_tracking.Application.Interfaces;
using System.Security.Claims;

namespace server_personal_tracking.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]

    public class PersonalTrackController : ControllerBase
    {
        private readonly IFinanceService _financeService;
        public PersonalTrackController(IFinanceService financeService)
        {
            _financeService = financeService;
        }

        [HttpGet("getfinance")]
        public async Task<IActionResult> GetAllFinance()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                throw new AppException("ไม่พบเจอ User นี้", 404);
            }

            var response = await _financeService.GetAllFinanAsyncs(userId);
            if(response == null)
            {
                throw new AppException("ไม่เจอข้อมูลการบันทึกรายรับรายจ่าย", 404);
            }
            return Ok(new {Message = "ดึงข้อมูลสำเร็จ", data=response});
        }

        [HttpPost("addfinance")]
        public async Task<IActionResult> AddFinance([FromBody] FinanceCreateDto financeDto)
        {

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized(new { message = "ไม่พบข้อมูลผู้ใช้ในระบบ" });
            }

            financeDto.UserId = userId;

            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _financeService.CreateFinance(financeDto);
            if (result == null)
            {
                return BadRequest("Failed to add finance");
            }
            return Ok(result);
        }

        [HttpGet("monthlysummary")]
        public async Task<IActionResult> GetMonthlySummary()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized(new { message = "ไม่พบข้อมูลผู้ใช้ในระบบ" });
            }

            int currentMonth = DateTime.UtcNow.Month;
            int currentYear = DateTime.UtcNow.Year;

            var summary = await _financeService.GetMonthlySummary(userId, currentMonth, currentYear);
            if (summary == null || !summary.Any())
            {
                return NotFound(new { message = "ไม่พบข้อมูลสรุปรายรับรายจ่ายสำหรับเดือนนี้" });
            }

            return Ok(new { Message = "ดึงข้อมูลสำเร็จ", Data = summary });
        }
    }
}
