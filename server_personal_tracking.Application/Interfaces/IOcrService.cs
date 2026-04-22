using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace server_personal_tracking.Application.Interfaces
{
    public interface IOcrService
    {
        string ExtractTextFromImageStream(Stream base64Image);
    }
}
