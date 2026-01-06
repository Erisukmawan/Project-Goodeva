import Swal from 'sweetalert2';

export const successAlert = (title, text) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 1500,
    showConfirmButton: false,
  });
};

export const errorAlert = (title, text) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
  });
};

export const confirmAlert = (title, text) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  });
};