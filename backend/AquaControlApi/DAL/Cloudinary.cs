using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entities;

namespace DAL
{
    internal class CloudinaryClient
    {
        private static CloudinaryClient instance;
        private Cloudinary cloudinary;

        private CloudinaryClient()
        {


            cloudinary = new Cloudinary(Environment.GetEnvironmentVariable("CLOUDINARY_URL"));
            cloudinary.Api.Secure = true;
        }

        internal static CloudinaryClient Instance
        {
            get
            {
                if (instance == null) instance = new CloudinaryClient();
                return instance;
            }
        }

        internal async Task<String> AddImage(Plantation plantation)
        {
            try
            {
                string publicId = "Crop" + plantation.CropType.Name + "Plantation" + plantation.Id + "Device" + plantation.Device.Id;

                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription("data:image/jpeg;base64," + plantation.Image),
                    PublicId = publicId,
                    Overwrite = true,
                    UniqueFilename = true
                };
                var uploadResult = await cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK) throw new Exception("No se pudo subir la imagen");

                plantation.Image = uploadResult.Url.ToString();

                return uploadResult.Url.ToString();

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        internal async Task DeleteImage(Plantation plantation)
        {
            try
            {

                int initIndex = plantation.Image.LastIndexOf("/");
                string publicId = plantation.Image.Substring(initIndex, 10);

                var delResParams = new DelResParams()
                {
                    PublicIds = new List<string> { publicId }
                };

                var deleteResult = await cloudinary.DeleteResourcesAsync(delResParams);

                if (deleteResult.StatusCode != System.Net.HttpStatusCode.OK) throw new Exception("No se pudo eliminar la imagen");

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

    }
}
