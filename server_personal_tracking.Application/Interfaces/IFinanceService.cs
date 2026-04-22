using server_personal_tracking.Application.DTOs;
using server_personal_tracking.Application.DTOs.Finance;


namespace server_personal_tracking.Application.Interfaces
{
    public interface IFinanceService
    {
        Task<FinanceResponseDto> CreateFinance(FinanceCreateDto financeDto);
        Task<List<FinanceResponseDto>> GetAllFinanAsyncs(int userId);
        Task<string> UploadImageToGCS(string base64Image);

        Task<List<MonthlyFinanceStatDto>> GetMonthlySummary(int userId, int month, int year);
    }
}
