using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace server_personal_tracking.Application.DTOs
{
    public class FinanceResponseDto
    {
        public decimal Amount { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public FinanceType Type { get; set; } = FinanceType.Income;
        public DateTime Date { get; set; }
    }
}
