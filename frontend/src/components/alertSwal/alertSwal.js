import Swal from "sweetalert2";
import "./alertSwal.css";

export const alertError = (title, error) => {
  Swal.fire({
    title: title,
    html: `<p class="msg">${error}</p>`,
    icon: "error",
    width: "350",
    customClass: {
      icon: "iconCustom",
      title: "titleCustom",
      confirmButton: "confirmButtonErrorCustom",
    },
  });
};

export const alertSuccess = (title) => {
  Swal.fire({
    title: title,
    icon: "success",
    width: "350",
    customClass: {
      icon: "iconCustom",
      title: "titleCustom",
      confirmButton: "confirmButtonSuccessCustom",
    },
  });
};

export const alertWarning = (title) => {
  Swal.fire({
    title: title,
    icon: "warning",
    width: "350",
    customClass: {
      icon: "iconCustom",
      title: "titleCustom",
      confirmButton: "confirmButtonWarningCustom",
    },
  });
};

export const alertConfirmDelete = async (title) => {
  const result = await Swal.fire({
    title: title,
    icon: "question",
    width: "450",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Confirmar",
    denyButtonText: "Cancelar",
    customClass: {
      icon: "iconCustom",
      title: "titleCustom",
      confirmButton: "confirmDeleteButton",
      denyButton: "cancelDeleteButton",
    },
  });

  return result;
};
