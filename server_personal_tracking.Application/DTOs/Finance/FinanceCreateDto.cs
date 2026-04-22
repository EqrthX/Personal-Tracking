

namespace server_personal_tracking.Application.DTOs.Finance
{
    public class FinanceCreateDto
    {
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public FinanceType Type { get; set; } = FinanceType.Income;
        public string? image { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}
