using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;

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

            string firstError = context.ModelState.Values.SelectMany(x => x.Errors).ToList().First().ErrorMessage;

            context.Result = new BadRequestObjectResult(new { message = firstError });
        }
    }
}