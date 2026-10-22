using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Api.Filters
{
    public class GlobalValidateOrigin : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            string localhostFrontend = Environment.GetEnvironmentVariable("LOCALHOST_FRONTEND");

            var origin = context.HttpContext.Request.Headers.ToList().First(header => header.Key == "Origin");

            if (origin.Value == localhostFrontend)
            {
                base.OnActionExecuting(context);
                return;
            }

            context.Result = new UnauthorizedObjectResult(new { message = "No posee permisos para acceder a este recurso" });
        }
    }
}
