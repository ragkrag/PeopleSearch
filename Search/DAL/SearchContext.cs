using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace Search.DAL
{
    public class SearchContext : DbContext
    {

        public SearchContext() : base("SearchContext")
        {
        }

        public DbSet<SearchModel> SearchData { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}