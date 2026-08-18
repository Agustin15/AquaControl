using Entities;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class Authentication
    {
        public string GenerateAccessJWTtoken(int idUser, int idDevice)
        {
            var localhostBackend = Environment.GetEnvironmentVariable("LOCALHOST_BACKEND");
            var tokenSecretKey = Environment.GetEnvironmentVariable("ACCESS_TOKEN_SECRET_KEY");
            var accessTokenExpiredMinutes = Environment.GetEnvironmentVariable("ACCESS_TOKEN_EXPIRED_MINUTES");

            if (localhostBackend is null) throw new Exception("LOCALHOST_BACKEND no definida");
            if (tokenSecretKey is null) throw new Exception("Variable ACCESS_TOKEN_SECRET_KEY no definida");
            if (accessTokenExpiredMinutes is null) throw new Exception("Variable ACCESS_TOKEN_EXPIRED_MINUTES no definida");

            //creacion del payload contenido del token a traves de claims
            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.NameIdentifier, Convert.ToString(idUser)));
            claims.Add(new Claim("IdDevice", Convert.ToString(idDevice)));

            //creacion de la claves secretas simetricas de la firma, que se usara para crear la firmas de los token
            ;
            var tokenSecretKeySymetric = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenSecretKey));

            var jwtToken = new JwtSecurityToken(issuer: localhostBackend, audience: localhostBackend,
                expires: DateTime.Now.AddMinutes(Convert.ToInt32(accessTokenExpiredMinutes)), claims: claims,
                   signingCredentials: new SigningCredentials(tokenSecretKeySymetric, SecurityAlgorithms.HmacSha256));

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);

        }

        public string GenerateRefreshJWTtoken(int idUser, int idDevice = 0)
        {
            var localhostBackend = Environment.GetEnvironmentVariable("LOCALHOST_BACKEND");
            var tokenSecretKey = Environment.GetEnvironmentVariable("REFRESH_TOKEN_SECRET_KEY");
            var refreshTokenExpiredMinutes = Environment.GetEnvironmentVariable("REFRESH_TOKEN_EXPIRED_MINUTES");

            if (localhostBackend is null) throw new Exception("LOCALHOST_BACKEND no definida");
            if (tokenSecretKey is null) throw new Exception("Variable REFRESH_TOKEN_SECRET_KEY no definida");
            if (refreshTokenExpiredMinutes is null) throw new Exception("Variable REFRESH_TOKEN_EXPIRED_MINUTES no definida");

            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.NameIdentifier, Convert.ToString(idUser)));
            claims.Add(new Claim("IdDevice", Convert.ToString(idDevice)));

            var tokenSecretKeySymetric = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenSecretKey));

            var jwtToken = new JwtSecurityToken(issuer: localhostBackend, audience: localhostBackend,
                expires: DateTime.Now.AddMinutes(Convert.ToInt32(refreshTokenExpiredMinutes)), claims: claims,
                   signingCredentials: new SigningCredentials(tokenSecretKeySymetric, SecurityAlgorithms.HmacSha256));

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);

        }

    }

}
