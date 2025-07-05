using Microsoft.EntityFrameworkCore;
using System;

namespace MediaService.Data
{
    public class AppDBContext:DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }
    }
}
