using MediaService.Data;
using MediaService.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var keycloakConfig = builder.Configuration.GetSection("Keycloak");
var vcv_client = builder.Configuration.GetSection("VCV_Client");
var vcv_api = builder.Configuration.GetSection("VCV_API");
var authority = keycloakConfig["Authority"];
var audience = keycloakConfig["Audience"];
var clientUrl = vcv_client["URL"];
var vcv_api_url = vcv_api["VCV_API_URL"];
//var clientUrl = vcv_client["URL_Dev"];
//var vcv_api_url = vcv_api["VCV_API_URL_DEV"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(clientUrl)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<AppDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IMediaService, MediaService.Services.MediaService>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = authority;
        options.RequireHttpsMetadata = false;
        options.Audience = audience;
    });

builder.Services.AddHttpClient("VCV_API", client =>
{
    client.BaseAddress = new Uri(vcv_api_url);
});


builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();
builder.Services.AddHttpContextAccessor();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseRouting();

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();

app.Run();
