using server_personal_tracking.Application.DTOs;
using server_personal_tracking.Application.DTOs.Finance;


namespace server_personal_tracking.Application.Interfaces
{
    public interface IAnalytics
    {
        public Task<AnalyticsResponseDto> DetailedReport(SummaryGetDto summaryGetDto);

    }
}
