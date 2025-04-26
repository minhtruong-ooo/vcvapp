using Microsoft.EntityFrameworkCore;
using VCV_API.Models;

namespace VCV_API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<AssetType> AssetTypes { get; set; }
        public DbSet<AssetStatus> AssetStatuses { get; set; }
        public DbSet<AssetTemplate> AssetTemplates { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<Location> Locations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AssetStatus>().ToTable("AssetStatus");
            modelBuilder.Entity<AssetType>().ToTable("AssetTypes");
            modelBuilder.Entity<AssetTemplate>().ToTable("AssetTemplates");
            modelBuilder.Entity<Asset>().ToTable("Assets");
            modelBuilder.Entity<Location>().ToTable("Locations");

            modelBuilder.Entity<AssetTemplate>()
                .HasOne(at => at.AssetType)
                .WithMany()
                .HasForeignKey(at => at.AssetTypeID);

        }
    }
}
