using server_personal_tracking.Application.Exceptions;
using server_personal_tracking.Application.Interfaces;
using System;
using System.IO;
using System.Text.RegularExpressions;
using Tesseract;

namespace server_personal_tracking.Infrastructure.Services
{
    public class TesseracOcrService : IOcrService
    {
        public string ExtractTextFromImageStream(Stream imageStream)
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string tessdataPath = Path.Combine(baseDir, "tessdata");

            string checkFilePath = Path.Combine(tessdataPath, "tha.traineddata");
            if (!Directory.Exists(tessdataPath))
            {
                return $"[Error] ไม่พบโฟลเดอร์ tessdata ใน {baseDir}";
            }
            if (!File.Exists(checkFilePath))
            {
                return $"[Error] ไม่พบไฟล์ tha.traineddata! กรุณาไปที่ VS -> คลิกที่ไฟล์ -> ตั้งค่า Copy to Output Directory ให้เป็น Copy always";
            }

            string extractedTotal = "ไม่พบยอดเงินในภาพ";

            if (imageStream == null || imageStream.Length == 0)
            {
                throw new AppException("ไม่พบข้อมูลไฟล์รูปภาพ", 400);
            }

            try
            {
                // ถ้าผ่านมาถึงตรงนี้ได้ แปลว่าไฟล์มีอยู่จริงแน่นอน 100%
                using (var engine = new TesseractEngine(tessdataPath, "tha+eng", EngineMode.Default))
                {
                    byte[] imageBytes;
                    using (var memoryStream = new MemoryStream())
                    {
                        imageStream.CopyTo(memoryStream);
                        imageBytes = memoryStream.ToArray();
                    }

                    using (var img = Pix.LoadFromMemory(imageBytes))
                    {
                        using (var page = engine.Process(img))
                        {
                            string text = page.GetText();
                            Console.WriteLine("=== ข้อความที่อ่านได้ ===");
                            Console.WriteLine(text);
                            Console.WriteLine("==========================");

                            string pattern = @"(รายการ|ยอดรวม|รวมทั้งสิ้น|รวม|Total|Net|สุทธิ|Amount).*?([0-9,]+\.\d{2})";
                            Match match = Regex.Match(text, pattern, RegexOptions.IgnoreCase);
                            if (match.Success)
                            {
                                extractedTotal = match.Groups[2].Value;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting text: {ex.Message}");
                return string.Empty;
            }

            return extractedTotal;
        }
    }
}