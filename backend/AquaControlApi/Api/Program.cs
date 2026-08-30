using dotenv.net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

DotEnv.Load(options: new DotEnvOptions(
   envFilePaths: ["../.env"]
));

var localhostFrontend = Environment.GetEnvironmentVariable("LOCALHOST_FRONTEND");
var localhostBackend = Environment.GetEnvironmentVariable("LOCALHOST_BACKEND");
var accessTokenSecretKey = Environment.GetEnvironmentVariable("ACCESS_TOKEN_SECRET_KEY");
var refreshTokenSecretKey = Environment.GetEnvironmentVariable("REFRESH_TOKEN_SECRET_KEY");
var deviceTokenSecretKey = Environment.GetEnvironmentVariable("DEVICE_TOKEN_SECRET_KEY");

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;

});


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowedHost",
                      policy =>
                      {

                          policy.WithOrigins(localhostFrontend);
                          policy.AllowAnyHeader();
                          policy.AllowAnyMethod();
                          policy.AllowCredentials();

                      });
});

builder.Services.AddAuthentication()
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = localhostBackend,
            ValidAudience = localhostBackend,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(accessTokenSecretKey))
        };
    }).AddJwtBearer("RefreshBearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = localhostBackend,
            ValidAudience = localhostBackend,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(refreshTokenSecretKey))
        };
    }).AddJwtBearer("Esp32Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer = localhostBackend,
            ValidAudience = localhostBackend,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(deviceTokenSecretKey))
        };
    }); ;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.UseCors("AllowedHost");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();