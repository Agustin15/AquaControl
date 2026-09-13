using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Api.Filters
{
    public class ValidateModelFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (context.ModelState.IsValid)
            {
                base.OnActionExecuting(context);
                return;
            }

            string firstError = context.ModelState.Values.First().Errors.First().ErrorMessage;

            context.Result = new BadRequestObjectResult(new { message = firstError });
        }
    }
}