using System;

namespace Search
{
    [Serializable]
    public class SearchModel
    {

        public int PersonId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Address { get; set; }
        public string Interests { get; set; }
        public string Image { get; set; }
        public int? Age { get; set; }


    }
}