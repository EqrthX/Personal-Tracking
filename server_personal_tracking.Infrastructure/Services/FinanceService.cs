using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using server_personal_tracking.Application.DTOs;
using server_personal_tracking.Application.DTOs.Finance;
using server_personal_tracking.Application.Exceptions;
using server_personal_tracking.Application.Interfaces;
using server_personal_tracking.Domain.Entities;
using System.Globalization;

namespace server_personal_tracking.Infrastructure.Services
{
    public class FinanceService : IFinanceService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public FinanceService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string> UploadImageToGCS(string base64Image)
        {
            if (string.IsNullOrEmpty(base64Image)) return null;

            string bucketName = _config["GoogleCloud:BucketName"];
            string accessToken = _config["GoogleCloud:GCPKey"];
            var credential = GoogleCredential.FromAccessToken(accessToken);
            var storage = await StorageClient.CreateAsync(credential);

            var base64Data = base64Image.Contains(",") ? base64Image.Split(',')[1] : base64Image;
            byte[] imageBytes = Convert.FromBase64String(base64Data);
            using var memoryStream = new MemoryStream(imageBytes);

            string fileName = $"receipts/{Guid.NewGuid()}.jpg";

            await storage.UploadObjectAsync(
                bucketName,
                fileName,
                "image/jpeg",
                memoryStream
            );

            return $"https://storage.googleapis.com/{bucketName}/{fileName}";
        }

        public async Task<FinanceResponseDto> CreateFinance(FinanceCreateDto financeDto)
        {
            if (financeDto == null)
            {
                throw new AppException(nameof(financeDto), 400);
            }

            if (financeDto.Amount <= 0)
            {
                throw new AppException("จำนวนเงินห้ามติดลบ", 400);
            }

            if (!decimal.TryParse(financeDto.Amount.ToString(), out _))
            {
                throw new AppException("จำนวนเงินต้องเป็นตัวเลข", 400);
            }

            string imageUrl = null;

            if (!string.IsNullOrEmpty(financeDto.image))
            {
                if (financeDto.image.Contains("data:image") &&
                   (!financeDto.image.Contains("jpeg") && !financeDto.image.Contains("jpg") && !financeDto.image.Contains("png")))
                {
                    throw new AppException("ไฟล์ที่อัปโหลดต้องเป็น .jpg, .jpeg หรือ .png เท่านั้น", 400);
                }

                imageUrl = await UploadImageToGCS(financeDto.image);
            }

            var finance = new Finance
            {
                Amount = financeDto.Amount,
                Description = financeDto.Description,
                Name = financeDto.Name,
                Date = financeDto.Date,
                image = imageUrl ?? "", 
                Type = financeDto.Type,
                UserId = financeDto.UserId,
                CreatedBy = financeDto.UserId.ToString()
            };

            _context.Finances.Add(finance);
            await _context.SaveChangesAsync();

            return new FinanceResponseDto
            {
                Amount = finance.Amount,
                Name = finance.Name,
                Description = finance.Description,
                Type = finance.Type,
                Date = finance.Date,
            };
        }
        
        public async Task<List<FinanceResponseDto>> GetAllFinanAsyncs(int userId)
        {
            if(userId != 0)
            {
                var selectFinance = await _context.Finances
                    .Where(f => f.UserId == userId) 
                    .OrderByDescending(f => f.Date) 
                    .Select(f => new FinanceResponseDto
                    {
                        Amount = f.Amount,
                        Description = f.Description,
                        Type = f.Type,
                        Date = f.Date
                    })
                    .ToListAsync();

                return selectFinance;
            } else
            {
                throw new AppException("ไม่เจอ User นี้", 404);
            }
        }
        
        public async Task<List<MonthlyFinanceStatDto>> GetMonthlySummary(int userId, int month, int year)
        {
            var dbResults = await _context.Finances
                .Where(t => t.Date.Year == year)
                .GroupBy(t => t.Date.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Income = g.Where(x => x.Type == FinanceType.Income).Sum(x => x.Amount),
                    Expense = g.Where(x => x.Type == FinanceType.Expense).Sum(x => x.Amount)
                })
                .ToListAsync();

            var fullYearStats = Enumerable.Range(1, 12).Select(monthNumber =>
            {
                var foundData = dbResults.FirstOrDefault(db => db.Month == monthNumber);

                return new MonthlyFinanceStatDto
                {
                    MonthNumber = monthNumber,
                    MonthName = new DateTime(year, monthNumber, 1).ToString("MMM", new CultureInfo("th-TH")),
                    Income = foundData?.Income ?? 0m,
                    Expense = foundData?.Expense ?? 0m
                };
            }).ToList();
            Console.WriteLine(fullYearStats);
            return fullYearStats;
        }
    }
}