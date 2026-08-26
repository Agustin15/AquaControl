using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    public class PlantController : ControllerBase
    {

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost]
        [Route("api/plant")]
        public async Task<ActionResult> Add([FromBody] Plant plant)
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != plant.Device.Id)
                    throw new Exception("La planta que quiere agregar no pertence al dispositivo que esta usando");

                List<Plant> plantsOfDevice = await new Lplant().GetAllPlantsByDevice(plant.Device.Id);

                if (plantsOfDevice.Count == 0) plant.Id = 1;
                else plant.Id = plantsOfDevice.Count + 1;

                await new Lplant().Add(plant);

                return StatusCode(201, true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPut]
        [Route("api/plant")]
        public async Task<ActionResult> Update([FromBody] Plant plant)
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != plant.Device.Id)
                    throw new Exception("La planta que quiere actualizar sus datos no pertence al dispositivo que esta usando");

             
                await new Lplant().Update(plant);

                return Ok(plant);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpDelete]
        [Route("api/plant")]
        public async Task<ActionResult> Delete(Plant plant)
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != plant.Device.Id)
                    throw new Exception("La planta que quiere eliminar no pertence al dispositivo que esta usando");

                await new Lplant().Delete(plant);

                return Ok(plant);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet]
        [Route("api/plant")]
        public async Task<ActionResult> GetAllPlantsByDevice()
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                List<Plant> plants = await new Lplant().GetAllPlantsByDevice(idDevice);

                if (plants.Count == 0) throw new Exception("No hay registros de plantas en este dispositivo");

                return Ok(plants);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }
    }
}