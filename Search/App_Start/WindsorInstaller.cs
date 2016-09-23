using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Data;
using System.Web.Mvc;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using PeopleSearch.DAL;

namespace Search
{
    public class WindsorInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {



            // controllers
            container.Register(Classes.FromThisAssembly()
                                      .BasedOn<IController>()
                                      .LifestylePerWebRequest());

            container.Register(Component.For(typeof(IsearchData))
                            .ImplementedBy(typeof(SearchData)));


            //// default interfaces
            container.Register(Classes.FromAssemblyInThisApplication().Pick()
                                      .WithServiceDefaultInterfaces()
                                      .LifestyleTransient());



        }

    }
}