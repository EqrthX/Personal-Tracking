using server_personal_tracking.Application.DTOs.User;


namespace server_personal_tracking.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto> RegisterAsync(UserCreateDto userDto);
        Task<string> LoginAsync(UserLoginDto userLoginDto);
    }
}
