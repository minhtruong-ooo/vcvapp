using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using VCV_API.Data;
using VCV_API.Services;
using VCV_API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

var keycloakConfig = builder.Configuration.GetSection("Keycloak");
var authority = keycloakConfig["Authority"];
var audience = keycloakConfig["Audience"];

var vcv_client = builder.Configuration.GetSection("VCV_Client");
var clientUrl = vcv_client["Url"];
//var clientUrl = vcv_client["URL_Dev"];


var vcv_media = builder.Configuration.GetSection("VCV_MEDIA_SERVICE");
var vcv_media_url = vcv_media["VCV_MEDIA_SERVICE_URL"];

// Add services to the container.

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = authority;
        options.RequireHttpsMetadata = false;
        options.Audience = audience;
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidIssuer = authority,
            ValidateIssuer = true,
            ValidateAudience = true,
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(clientUrl)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMediaService", policy =>
    {
        policy.WithOrigins(vcv_media_url)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});



builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IAssetTemplates, AssetTemplatesService>();
builder.Services.AddScoped<IAssetStatus, AssetStatusService>();
builder.Services.AddScoped<IAssetLocation, AssetLocationService>();
builder.Services.AddScoped<IAssetAssign, AssetAssignment>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IAssetSpec, AssetSpecService>();
builder.Services.AddScoped<IAssetType, AssetTypeService>();
builder.Services.AddScoped<IAssetOrigin, OriginService>();
builder.Services.AddScoped<IAssetCompany, CompanyService>();


builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseRouting();

app.UseCors("AllowReactApp");
//app.UseCors("AllowMediaService");

app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    var authHeader = context.Request.Headers["Authorization"].ToString();
    Console.WriteLine("=== Middleware Authorization Header ===");
    Console.WriteLine(string.IsNullOrWhiteSpace(authHeader) ? "Không có Authorization" : authHeader);
    await next.Invoke();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
