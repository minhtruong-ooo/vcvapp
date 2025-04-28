using Microsoft.EntityFrameworkCore;
using VCV_API.Models;

namespace VCV_API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
