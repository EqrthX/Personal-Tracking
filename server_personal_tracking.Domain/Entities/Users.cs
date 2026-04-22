using System;
using System.ComponentModel.DataAnnotations;

namespace server_personal_tracking.Domain.Entities;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    [RegularExpression(@"^[\p{L}\s\-']+$", ErrorMessage = "Name can only contain letters, spaces, hyphens, and apostrophes.")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid email format.")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public bool IsActive { get; set; } = true;

    [Required]
    public RoleUser Role { get; set; } = RoleUser.User;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public ICollection<Finance> Finances { get; set; } = new List<Finance>();
}

public enum RoleUser
{
    Admin,
    User
}