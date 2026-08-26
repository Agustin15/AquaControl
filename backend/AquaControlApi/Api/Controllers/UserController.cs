using Api.Model;
using dotenv.net;
using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace Api.Controllers
{
    [ApiController]
    public class UserController : ControllerBase
    {

        [AllowAnonymous]
        [HttpPost]
        [Route("api/user/signup")]
        public async Task<ActionResult> SignUp([FromBody] User user)
        {

            try
            {
                user.ValidationPassword();

                var result = await new Luser().Signup(user);

                return StatusCode(201, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("api/user/login")]
        public async Task<ActionResult> Login([FromBody] LoginDto login)
        {
            try

            {
                if (login is null) throw new Exception("Debe indicar credenciales");

                User user = new User();
                user.Username = login.Username;
                user.Password = login.Password;

                var result = await new Luser().Login(user);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(401, new { message = ex.Message });
            }
        }

    }
}
