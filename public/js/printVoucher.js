function printVoucher(voucherCode) {
  fetch(`/dashboard/print-voucher/${voucherCode}`)
    .then((response) => response.json())
    .then((data) => {
      const pdfBlob = base64ToBlob(data.base64PDF, "application/pdf");
      const url = URL.createObjectURL(pdfBlob);
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    })
    .catch((error) => {
      showToast("Failed to print voucher", "error");
      console.log("error: ", error);
    });
}

function base64ToBlob(base64, type) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: type });
}
