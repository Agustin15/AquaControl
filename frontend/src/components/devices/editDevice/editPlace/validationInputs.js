export const validation = (name, value) => {
  let inputError = "";

  if (name == "placeName" && value.length == 0)
    inputError = "Lugar no puede estar vacio";
  else if (
    name == "location" &&
    !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+,\s*[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)
  )
    inputError = "Formato de ubicacion debe ser Ciudad,Pais";

  return inputError;
};
