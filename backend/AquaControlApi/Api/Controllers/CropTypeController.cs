using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{

    [ApiController]
    public class CropTypeController : ControllerBase
    {

        [Authorize(AuthenticationSchemes = "Bearer")]
        [Route("api/cropType")]
        [HttpGet]
        public async Task<ActionResult> GetCropsTypes()
        {

            try
            {
                List<CropType> cropsTypes = await new LcropType().GetAllCropsTypes();

                if (cropsTypes.Count == 0) throw new Exception("No se encontraron registros de cultivo en el sistema");

                return Ok(cropsTypes);
            }
            catch (Exception ex)
            {

                return StatusCode(404, new { message = ex.Message });

            }

        }
    }
}
