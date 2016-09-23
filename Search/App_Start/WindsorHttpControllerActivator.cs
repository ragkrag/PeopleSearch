using System;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Dispatcher;
using Castle.Windsor;

namespace PeopleSearch.App_Start
{
      public class WindsorHttpControllerActivator : IHttpControllerActivator
        {
            private readonly IWindsorContainer container;

            public WindsorHttpControllerActivator(IWindsorContainer container)
            {
                this.container = container;
            }

            public IHttpController Create(HttpRequestMessage request, HttpControllerDescriptor descriptor, Type type)
            {
                var controller = (IHttpController)container.Resolve(type);
                request.RegisterForDispose(new Release(() => container.Release(controller)));
                return controller;
            }

            private class Release : IDisposable
            {
                private readonly Action release;

                public Release(Action release)
                {
                    this.release = release;
                }

                public void Dispose()
                {
                    release();
                }
            }
        }


    }
