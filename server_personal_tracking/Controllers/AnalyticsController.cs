using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server_personal_tracking.Application.DTOs.Finance;
using server_personal_tracking.Application.Interfaces;
using server_personal_tracking.Infrastructure.Services;
using System.Security.Claims;

namespace server_personal_tracking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalytics _analyticsService;
        public AnalyticsController(IAnalytics analyticsService)
        {
            _analyticsService = analyticsService;
        }
        [HttpPost("summary")]
        public async Task<IActionResult> GetSummary([FromBody] SummaryGetDto summaryGetDto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized(new { message = "ไม่พบข้อมูลผู้ใช้ในระบบ" });
            }

            if (summaryGetDto == null)
            {
                return BadRequest("Invalid request data.");
            }

            summaryGetDto.UserId = userId;
            var result = await _analyticsService.DetailedReport(summaryGetDto);

            if(result == null)
            {
                return BadRequest();
            }

            return Ok(result);
        }

    }
}
