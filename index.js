var openDialogButton = document.getElementById("openDialog");
var closeDialogButton = document.getElementById("closeDialog");
var dialog = document.getElementById("dialog");

openDialogButton.addEventListener("click", function () {
  dialog.style.display = "block";
});

closeDialogButton.addEventListener("click", function () {
  dialog.style.display = "none";
});
