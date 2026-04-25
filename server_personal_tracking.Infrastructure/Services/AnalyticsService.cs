using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using server_personal_tracking.Application.DTOs;
using server_personal_tracking.Application.DTOs.Finance;
using server_personal_tracking.Application.Exceptions;
using server_personal_tracking.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace server_personal_tracking.Infrastructure.Services
{
    public class AnalyticsService : IAnalytics
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        public AnalyticsService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<AnalyticsResponseDto> DetailedReport(SummaryGetDto summaryGetDto)
        {
            if (summaryGetDto.StartDate == null || summaryGetDto.EndDate == null)
            {
                throw new AppException("กรุณาระบุวันที่เริ่มต้นและวันที่สิ้นสุด", 400);
            }
            var parsedStartDate = DateTime.Parse(summaryGetDto.StartDate).Date;
            var parsedEndDate = DateTime.Parse(summaryGetDto.EndDate).Date;

            var endDateLimit = parsedEndDate.AddDays(1);

            var rawData = await _context.Finances
                .Where(f => f.UserId == summaryGetDto.UserId && (f.Date >= parsedStartDate && f.Date < endDateLimit))
                .Select(f => new FinanceRecordDto
                {
                    Amount = f.Amount,
                    Type = f.Type.ToString()
                })
                .ToListAsync();

            if (!rawData.Any())
            {
                throw new AppException("ไม่พบข้อมูลในช่วงวันที่ที่ระบุ", 404);
            }

            var countReport = rawData.Count;
            var avgReport = rawData.Any() ? rawData.Average(a => a.Amount) : 0;
            var maxExpenes = rawData.Where(t => t.Type == "Expense")
                .Select(a => a.Amount)
                .DefaultIfEmpty(0)
                .Max();
            var maxIncome = rawData.Where(t => t.Type == "Income")
                .Select(a => a.Amount)
                .DefaultIfEmpty(0)
                .Max();

            var response = new AnalyticsResponseDto
            {
                CountReport = countReport,
                AverageReport = avgReport,
                MaxExpense = maxExpenes,
                MaxIncome = maxIncome,
                StartDate = parsedStartDate,
                EndDate = parsedEndDate,
                Records = rawData
            };

            return response;
        }
    }
}
