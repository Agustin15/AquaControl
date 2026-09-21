using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entities;
using Microsoft.Data.SqlClient;
using DAL;

namespace Logic
{
    public class Luser
    {
        public async Task<int> Add(User user)
        {
            if (user is null) throw new Exception("Debe indicar un usuario a agregar");

            int idGenerated = await new Puser().Add(user);
            return idGenerated;
        }

        public async Task<object> Signup(User user)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            SqlTransaction transaction = null;

            try
            {
                if (user is null) throw new Exception("Debe indicar credenciales");

                Authentication authentication = new Authentication();

                User userAlreadyExist = await new Luser().GetUserByUsername(user.Username);

                if (!(userAlreadyExist is null)) throw new Exception("Nombre de usuario ya existente");

                User emailAlreadyUsed = await new Luser().GetUserByEmail(user.Username);

                if (!(emailAlreadyUsed is null)) throw new Exception("Correo electronico ya en uso");

                string salt = BCrypt.Net.BCrypt.GenerateSalt(10);

                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, salt);

                await connection.OpenAsync();

                transaction = connection.BeginTransaction();

                int idGenerated = await new Puser().AddWithTransaction(user, transaction);
                user.Id = idGenerated;

                //creacion del token de acceso y de actualizacion
                var jwtAccessTokenSerialized = authentication.GenerateAccessJWTtoken(user);
                var jwtRefreshTokenSerialized = authentication.GenerateRefreshJWTtoken(user);

                await transaction.CommitAsync();

                return new
                {
                    user = new
                    {
                        id = idGenerated,
                        username = user.Username,
                        email = user.Email,
                        password = "",
                        role = user.Role,
                        joined = user.Joined,
                    },
                    accessToken = jwtAccessTokenSerialized,
                    refreshToken = jwtRefreshTokenSerialized
                };

            }
            catch (Exception ex)
            {
                if (transaction != null)
                    await transaction.RollbackAsync();

                throw ex;
            }
            finally
            {
                await connection.CloseAsync();
            }
        }

        public async Task<object> Login(User user)
        {
            if (user is null) throw new Exception("Usuario o contraseña incorrectas");

            Authentication authentication = new Authentication();

            User userFound = await new Puser().GetUserByUsername(user.Username);

            if (userFound is null) throw new Exception("Usuario o contraseña incorrectas");

            bool match = BCrypt.Net.BCrypt.Verify(user.Password, userFound.Password);

            if (!match) throw new Exception("Usuario o contraseña incorrectas");

            //creacion del token de acceso y de actualizacion
            List<Device> devices = await new Ldevice().GetDevicesByIdUser(userFound.Id);
            string roleInDevice = "";

            if (devices.Count > 0 && devices.Exists(device => device.UsersOfDevice.Exists(ud => ud.User.Id == userFound.Id && ud.Role == "Operador")))
                roleInDevice = "Operador";

            string jwtAccessTokenSerialized = authentication.GenerateAccessJWTtoken(userFound, roleInDevice: roleInDevice);
            string jwtRefreshTokenSerialized = authentication.GenerateRefreshJWTtoken(userFound, roleInDevice: roleInDevice);

            return new
            {
                user = new
                {
                    id = userFound.Id,
                    username = userFound.Username,
                    email = userFound.Email,
                    password = "",
                    role = userFound.Role,
                    joined = userFound.Joined,
                },
                accessToken = jwtAccessTokenSerialized,
                refreshToken = jwtRefreshTokenSerialized
            };

        }

        public async Task UpdateUser(User user)
        {
            if (user is null) throw new Exception("Debe indicar un usuario a actualizar");
            await new Puser().UpdateUser(user);

        }


        public async Task<User> GetUserById(int idUser)
        {

            return await new Puser().GetUserById(idUser);

        }

        public async Task<User> GetUserByUsername(string username)
        {
            return await new Puser().GetUserByUsername(username);


        }
        public async Task<User> GetUserByEmail(string email)
        {
            return await new Puser().GetUserByEmail(email);
        }

        public async Task<List<User>> GetUsersMatchByText(string text)
        {
            return await new Puser().GetUsersMatchByText(text);


        }

    }
}
