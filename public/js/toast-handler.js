function showToast(message, type) {
  if (message && type) {
    Toastify({
      text: message,
      duration: 553000,
      position: "right",
      className: type,
      close: true,
      gravity: "top",
      style: {
        background:
          type === "success"
            ? "#28a745"
            : type === "error"
            ? "#dc3545"
            : type === "warning"
            ? "#ffc107"
            : "#17a2b8",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
}
