var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOrchardCms();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseOrchardCore();

app.Run();
