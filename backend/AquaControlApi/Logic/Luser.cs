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

            SqlConnection connection = new SqlConnection(Connection.Cnn);
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

                int idGenerated = await new Puser().AddWithTransaction(user, connection, transaction);

                //creacion del token de acceso y de actualizacion
                var jwtAccessTokenSerialized = authentication.GenerateAccessJWTtoken(idGenerated, 0);
                var jwtRefreshTokenSerialized = authentication.GenerateRefreshJWTtoken(idGenerated, 0);

                await transaction.CommitAsync();

                return new
                {
                    user = new
                    {
                        idUser = idGenerated,
                        username = user.Username,
                        email = user.Email,
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
            if (user is null) throw new Exception("Debe indicar credenciales");

            Authentication authentication = new Authentication();

            User userFound = await new Puser().GetUserByUsername(user.Username);

            if (userFound is null) throw new Exception("Usuario no encontrado");

            bool match = BCrypt.Net.BCrypt.Verify(user.Password, userFound.Password);

            if (!match) throw new Exception("Usuario o contraseña incorrectas");

            //creacion del token de acceso y de actualizacion

            string jwtAccessTokenSerialized = authentication.GenerateAccessJWTtoken(userFound.Id, 0);
            string jwtRefreshTokenSerialized = authentication.GenerateRefreshJWTtoken(userFound.Id, 0);

            return new
            {
                user = new
                {
                    idUser = userFound.Id,
                    username = userFound.Username,
                    email = userFound.Email,
                    joined = userFound.Joined,
                },
                accessToken = jwtAccessTokenSerialized,
                refreshToken = jwtRefreshTokenSerialized
            };

        }

        public async Task UpdateUsername(User user)
        {
            if (user is null) throw new Exception("Debe indicar un usuario a actualizar");

            await new Puser().UpdateUsername(user);

        }
        public async Task UpdatePasswordUser(User user)
        {
            if (user is null) throw new Exception("Debe indicar un usuario a actualizar");

            await new Puser().UpdatePasswordUser(user);

        }

        public async Task<List<User>> GetAllUsers()
        {
            List<User> users = new List<User>();

            users = await new Puser().GetAllUsers();

            return users;

        }

        public async Task<User> GetUserByUsername(string username)
        {
            User user = await new Puser().GetUserByUsername(username);

            return user;

        }
        public async Task<User> GetUserByEmail(string email)
        {
            User user = await new Puser().GetUserByEmail(email);

            return user;

        }

        public async Task<User> GetUserById(int idUser)
        {
            User user = await new Puser().GetUserById(idUser);
            return user;

        }
    }
}
