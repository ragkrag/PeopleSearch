using System;
using System.Collections.Generic;
using System.Web.Mvc;
using PeopleSearch.DAL;

namespace Search.Controllers
{
    public class SearchApiController : Controller
    {
        private readonly IsearchData _sd;
        public SearchApiController(IsearchData sd)
        {
            _sd = sd;
        }

        [HttpGet]
        public JsonResult GetFilteredData(string filter)
        {
            var result = new List<SearchModel>();
            if (!String.IsNullOrEmpty(filter))
            {
               result = _sd.GetPersonDetails(filter);
            }
            
               return Json(result, JsonRequestBehavior.AllowGet);
           
        }           
    }

}