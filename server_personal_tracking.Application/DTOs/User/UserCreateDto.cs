using server_personal_tracking.Domain.Entities;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;


namespace server_personal_tracking.Application.DTOs.User
{
    public class UserCreateDto
    {
        [Required]
        [StringLength(100)]
        [DefaultValue("Jone Doe")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid email format.")]
        [DefaultValue("JoneDoe@email.com")]

        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        [DefaultValue("JoneDoe123.")]

        public string Password { get; set; } = string.Empty;

        [Required]
        [DefaultValue("User")]
        public RoleUser Role { get; set; } = RoleUser.User;
    }
}
