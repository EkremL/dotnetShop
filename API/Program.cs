using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Middlewares;
using API.Entity;
using Microsoft.AspNetCore.Identity;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//!Adding dbcontext to the container
builder.Services.AddDbContext<DataContext>(options =>{
    var config = builder.Configuration;
    var connectionString = config.GetConnectionString("defaultConnection");
//?bu uygulamada sqlite kullanıldığı için bu şekilde belirtiyoruz
    options.UseSqlite(connectionString);
});

//!Adding CORS policy to the container
builder.Services.AddCors();
//!Adding Identity
builder.Services.AddIdentity<AppUser,AppRole>().AddEntityFrameworkStores<DataContext>(); //tablolar direkt datacontexte eklenecek. bunu ekledikten sonra migrationu da ekliyoruz.

//!Identity Configuration
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireDigit = false;

    options.User.RequireUniqueEmail = true;
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
});
//!add authentication (verification)
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false;
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                // ValidIssuer = "sadikturan.com",
                // ValidIssuers = ["",""],
                ValidateAudience = false,
                ValidAudience = "abc",
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(
                    builder.Configuration["JWTSecurity:SecretKey"]!)),
                ValidateLifetime = true
            };
        });

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
//! builder.Services.AddScoped<TokenService>(); kodu, ASP.NET Core uygulamadaki Dependency Injection (DI) konteynerine TokenService sınıfını ekler ve bu servisin scoped (ömrü sınırlı) bir yaşam süresiyle kullanılmasını sağlar.Scoped yaşam süresi, her HTTP isteği başına bir örnek oluşturulması anlamına gelir. Yani, bir HTTP isteği geldiğinde, TokenService sınıfından bir nesne oluşturulur ve bu nesne, o istek tamamlanana kadar yaşamaya devam eder. Başka bir istek geldiğinde, yeni bir nesne oluşturulur.
builder.Services.AddScoped<TokenService>();

var app = builder.Build();

app.UseMiddleware<ExceptionHandling>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => {
        options.SwaggerEndpoint("/openapi/v1.json","Demo API");
    });
    //!scalar
    app.MapScalarApiReference();
    //swagger yerine scalar üzerinden tokeni test ettik, postman da kullanılabilirdi. localhost/scalar/v1
}

app.UseHttpsRedirection();

//statik dosyaları kullanmak icin; (wwwroot)
app.UseStaticFiles();

app.UseCors(opt =>{ //allowcredentials cookielere izin verir. Ama bu izni clientte de tanımlamamız gerekiyor (requests.ts)
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});
//!added authentication
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

SeedDatabase.Initialize(app);

app.Run();
