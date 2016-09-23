﻿using System.Collections.Generic;
using Moq;
using PeopleSearch.DAL;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Search.Controllers.Tests
{
    [TestClass()]
    // [TestFixture]
    public class SearchApiControllerTests
    {
        private Mock<PeopleSearchEntities> _sDB;
        private Mock<SearchApiController> _sap;
        private Mock<IsearchData> _searchData;
        [TestMethod()]
        public void GetFilteredDataTest()
        {
            _sDB = new Mock<PeopleSearchEntities>();
            _sap = new Mock<SearchApiController>();
            _searchData = new Mock<IsearchData>();

            var sr = new SearchModel
            {
                PersonId = 1,
                FirstName = "rag",
                LastName = "kol",
                Age = 25,
                Address = "14049 Barkley",
                Interests = "cricket,movies",
                Image = ""
            };
            _searchData.Setup(x => x.GetPersonDetails(It.IsAny<string>()))
            .Returns(new List<SearchModel>() { sr });

            var actual = new SearchApiController(_searchData.Object);
            var value = actual.GetFilteredData("rag");
            List<SearchModel> result = value.Data as List<SearchModel>;
            NUnit.Framework.Assert.AreEqual(1, result.Count);
            NUnit.Framework.Assert.AreEqual(1, result[0].PersonId);
            NUnit.Framework.Assert.AreEqual("rag", result[0].FirstName);
            NUnit.Framework.Assert.AreEqual("kol", result[0].LastName);
            NUnit.Framework.Assert.AreEqual(25, result[0].Age);
            NUnit.Framework.Assert.AreEqual("cricket,movies", result[0].Interests);
            NUnit.Framework.Assert.AreEqual(1, result[0].PersonId);

        }
    }
}