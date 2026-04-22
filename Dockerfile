FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["server_personal_tracking/server_personal_tracking.API.csproj", "server_personal_tracking/"]
COPY ["server_personal_tracking.Application/server_personal_tracking.Application.csproj", "server_personal_tracking.Application/"]
COPY ["server_personal_tracking.Domain/server_personal_tracking.Domain.csproj", "server_personal_tracking.Domain/"]
COPY ["server_personal_tracking.Infrastructure/server_personal_tracking.Infrastructure.csproj", "server_personal_tracking.Infrastructure/"]

RUN dotnet restore "server_personal_tracking/server_personal_tracking.API.csproj"

COPY . .

WORKDIR /src/server_personal_tracking
RUN dotnet publish "server_personal_tracking.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

# Run the correct .API.dll file
ENTRYPOINT ["dotnet", "server_personal_tracking.API.dll"]