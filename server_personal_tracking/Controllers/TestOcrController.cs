using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server_personal_tracking.Application.Interfaces;
using System.Threading.Tasks;

namespace server_personal_tracking.API.Controllers
{
    public class FileUploadRequest
    {
        public IFormFile file { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TestOcrController : ControllerBase
    {
        private readonly IOcrService _ocrService;

        public TestOcrController(IOcrService ocrService)
        {
            _ocrService = ocrService;
        }

        // ใช้ [FromForm] เพื่อให้ Swagger แสดงปุ่มอัปโหลดไฟล์
        [HttpPost("extract-from-file")]
        [Consumes("multipart/form-data")]
        public IActionResult ExtractFromFile([FromForm] FileUploadRequest req)
        {
            if (req.file == null || req.file.Length == 0)
            {
                return BadRequest(new { message = "กรุณาแนบไฟล์รูปภาพมาด้วยครับ" });
            }

            string totalAmount = _ocrService.ExtractTextFromImageStream(req.file.OpenReadStream());

            return Ok(new
            {
                fileName = req.file.FileName,
                extractedAmount = totalAmount
            });
        }
    }
}