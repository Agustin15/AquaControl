using Api.Filters;
using DAL;
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
    public class PlantationController : ControllerBase
    {

        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDevice")]
        [ValidateModelFilter]
        [HttpPost]
        [Route("api/plantation")]
        public async Task<ActionResult> Add([FromBody] Plantation plantation)
        {
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != plantation.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego donde desea agregar registro de esta planta" });

                List<Plantation> plantsOfDevice = await new Lplantation().GetAllPlantationsByDevice(plantation.Device.Id);

                if (plantsOfDevice.Count == 0) plantation.Id = 1;
                else plantation.Id = plantsOfDevice.Count + 1;

                await new Lplantation().Add(plantation);

                return StatusCode(201, true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDevice")]
        [ValidateModelFilter]
        [HttpPut]
        [Route("api/plantation")]
        public async Task<ActionResult> Update([FromBody] Plantation plantation)
        {
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != plantation.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego donde desea actualizar el registro de esta planta" });


                await new Lplantation().Update(plantation);

                return Ok(plantation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDevice")]
        [ValidateModelFilter]
        [HttpDelete]
        [Route("api/plantation")]
        public async Task<ActionResult> Delete(Plantation plantation)
        {
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != plantation.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego donde desea eliminar el registro de esta planta" });

                await new Lplantation().Delete(plantation);

                return Ok(plantation);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDevice")]
        [HttpGet]
        [Route("api/plantation")]
        public async Task<ActionResult> GetAllPlantsByDevice()
        {
            try
            {
       
                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                List<Plantation> plants = await new Lplantation().GetAllPlantationsByDevice(idDevice);

                if (plants.Count == 0) throw new Exception("No hay registros de plantas en este dispositivo de riego");

                return Ok(plants);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }
    }
}