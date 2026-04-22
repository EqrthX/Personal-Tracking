

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server_personal_tracking.Domain.Entities
{
    public class Finance
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid transactionId { get; set; } = Guid.NewGuid();

        [Required]
        [Range(typeof(decimal), "0.01", "1000000000", ErrorMessage = "จำนวนเงินต้องมากกว่า 0")]
        [Column(TypeName = "decimal(18,2)")] 
        public decimal Amount { get; set; }

        [Required(ErrorMessage ="กรุณาระบุชื่อที่ทำรายการ")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "กรุณาระบุรายละเอียดของรายการ")]
        public string Description { get; set; } = string.Empty;
        public FinanceType Type { get; set; } = FinanceType.Income;
        public string? image { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;

        public int UserId { get; set; }
        public User User { get; set; } = null;
    }
}

public enum FinanceType
{
    Income,
    Expense
}