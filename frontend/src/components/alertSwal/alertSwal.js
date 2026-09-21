import Swal from "sweetalert2";
import "./alertSwal.css";

export const getErrorMessage = (
  error,
  fallbackMessage = "Ocurrió un error inesperado",
) => {
  if (typeof error === "string" && error.trim()) return error;
  if (error && typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }
  if (
    error &&
    error.response &&
    typeof error.response.data?.message === "string" &&
    error.response.data.message.trim()
  ) {
    return error.response.data.message;
  }
  return fallbackMessage;
};

export const alertError = (title, error) => {
  const message = getErrorMessage(error);

  Swal.fire({
    title: title,
    html: `<p>${message}</p>`,
    icon: "error",
    customClass: {
      popup:"popupAlertError",
    },
  });
};

export const alertSuccess = (title) => {
  Swal.fire({
    title: title,
    icon: "success",
    customClass: {
     popup:"popupAlertSuccess",
    },
  });
};

export const alertWarning = (title) => {
  Swal.fire({
    title: title,
    icon: "warning",
    customClass: {
      icon: "iconCustom",
      popup:"popupAlertWarning"
    },
  });
};

export const alertConfirmDelete = async (title) => {
  const result = await Swal.fire({
    title: title,
    icon: "question",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Confirmar",
    denyButtonText: "Cancelar",
    customClass: {
      icon: "iconCustom",
      popup: "popupAlertConfirmDelete",
      confirmButton: "confirmButton",
      denyButton: "denyButton",
    },
  });

  return result;
};

export const alertErrorIrrigation = (title, icon) => {
  Swal.fire({
    title: title,
    imageUrl: icon,
    imageHeight: "66",
    imageWidth: "66",
    customClass: {
      popup: "popupAlertIrrigation",
    },
  });
};
