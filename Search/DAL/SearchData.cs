using System.Collections.Generic;
using System.Linq;
using Search;

namespace PeopleSearch.DAL
{

    public interface IsearchData
    {
       List<SearchModel> GetPersonDetails(string filter);
    }
    public class SearchData : IsearchData    
    {
        private PeopleSearchEntities _db;
        public SearchData()
    {

    }
    public SearchData(PeopleSearchEntities db)
    {
        _db = db;
    }
    public List<SearchModel> GetPersonDetails(string filter)
        {

            if (_db == null)
            {
                _db = new PeopleSearchEntities();
            }

            var details = (from pd in _db.PersonDetails
                           join p in _db.Pictures on pd.PersonId equals p.PersonId
                           where (pd.FirstName.Contains(filter) || pd.LastName.Contains(filter))
                           select new SearchModel
                           {
                               PersonId = pd.PersonId,
                               FirstName = pd.FirstName,
                               LastName = pd.LastName,
                               Age = pd.Age,
                               Address = pd.Address,
                               Interests = pd.Interests,
                               Image = p.Picture1
                           }).ToList();

            return details;

        }
    }
}