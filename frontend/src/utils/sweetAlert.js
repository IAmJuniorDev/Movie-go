import Swal from "sweetalert2";

export const confirmAction = async ({ title, text, icon, confirmButtonText }) => {
  return await Swal.fire({
    title: title || "Are you sure?",
    text: text || "This action cannot be undone.",
    icon: icon||"warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmButtonText || "Yes, proceed!",
  });
};

export const onLoading = ()=>{
  return Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const onSuccess = ({text})=>{
  return Swal.fire({
    icon: "success",
    title: "Success",
    text: text || `Process successfully!`,
    timer: 1500,
    showConfirmButton: false,
  });
}

export const onError = ({text})=>{
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: text||"Process erorr",
    timer: 2000,
    showConfirmButton: false,
  });
}