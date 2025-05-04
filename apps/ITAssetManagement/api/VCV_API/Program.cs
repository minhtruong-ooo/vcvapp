using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using VCV_API.Data;
using VCV_API.Services;
using VCV_API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

var keycloakConfig = builder.Configuration.GetSection("Keycloak");
var authority = keycloakConfig["Authority"];
var audience = keycloakConfig["Audience"];

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IAssetTemplates, AssetTemplatesService>();
builder.Services.AddScoped<IAssetStatus, AssetStatusService>();
builder.Services.AddScoped<IAssetLocation, AssetLocationService>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = authority;
        options.RequireHttpsMetadata = false;
        options.Audience = audience;
    });

builder.Services.AddHttpClient("media", client =>
{
    client.BaseAddress = new Uri("https://localhost:7299");
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
