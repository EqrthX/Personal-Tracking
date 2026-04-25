using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace server_personal_tracking.Application.DTOs.Finance
{
    public class FinanceRecordDto
    {
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty;
    }
    public class AnalyticsResponseDto
    {
        public int CountReport { get; set; }
        public decimal AverageReport { get; set; }
        public decimal MaxExpense { get; set; }
        public decimal MaxIncome { get; set; }
        public List<FinanceRecordDto> Records { get; set; } = new List<FinanceRecordDto>();
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
