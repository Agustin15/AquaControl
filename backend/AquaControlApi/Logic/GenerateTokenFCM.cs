using Entities;
using Google.Apis.Auth.OAuth2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class GenerateTokenFCM
    {
        public static async Task<String> GenerateAccessToken()
        {

            string pathToServiceAccountKey = Environment.GetEnvironmentVariable("FILE_PATH_GOOGLE_APPLICATION_CREDENTIALS");

            if (String.IsNullOrEmpty(pathToServiceAccountKey)) throw new Exception("FILE_PATH_GOOGLE_APPLICATION_CREDENTIALS no declarado");

            string[] scopes = { "https://www.googleapis.com/auth/firebase.messaging" };
            GoogleCredential credential;

            using (var stream = new FileStream(pathToServiceAccountKey, FileMode.Open, FileAccess.Read))
            {
                credential = GoogleCredential.FromStream(stream)
                                            .CreateScoped(scopes);
            }

            var accessToken = await credential.UnderlyingCredential.GetAccessTokenForRequestAsync();

            return accessToken;
        }
    }
}
