using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace server_personal_tracking.Application.DTOs.Finance
{
    public class MonthlyFinanceStatDto
    {
        public int MonthNumber {get; set; }
        public string MonthName {get; set; }
        public decimal Income {get; set; }
        public decimal Expense {get; set; }
    }
}
