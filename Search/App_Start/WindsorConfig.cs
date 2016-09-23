using System.Web.Mvc;
using Castle.Windsor;
using Castle.Windsor.Installer;
using System.Web.Http;
using System.Web.Http.Dispatcher;
using PeopleSearch.App_Start;

namespace Search
{
    public static class WindsorConfig
    {
        public static void Register()
        {
            var container = new WindsorContainer().Install(FromAssembly.InThisApplication());
            //mvc
            DependencyResolver.SetResolver(new WindsorDependencyResolver(container));
            // web api
            GlobalConfiguration.Configuration.Services.Replace(typeof(IHttpControllerActivator), new WindsorHttpControllerActivator(container));
        }
    }
}