using Microsoft.EntityFrameworkCore;
using server_personal_tracking.Domain.Entities;

namespace server_personal_tracking.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Finance> Finances { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Password).IsRequired().HasMaxLength(100);
                entity.Property(e => e.IsActive).IsRequired();
                entity.Property(e => e.Role).HasColumnType("nvarchar(20)").IsRequired();
                entity.Property(u => u.CreatedDate)
                  .HasDefaultValueSql("GETUTCDATE()");
            });
            modelBuilder.Entity<Finance>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.transactionId).IsUnique();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Amount).IsRequired().HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Finances)
                      .HasForeignKey(e => e.UserId);
            });
        }
    }
}
