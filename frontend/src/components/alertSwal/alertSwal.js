import Swal from "sweetalert2";
import "./alertSwal.css";

export const alertError = (title, error) => {
  Swal.fire({
    title: title,
    html: `<p>${error}</p>`,
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
