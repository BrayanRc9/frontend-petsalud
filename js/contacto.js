
document.getElementById("contacto-form").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Mensaje enviado correctamente. Pronto nos comunicaremos contigo.");
  this.reset();
});

document.getElementById("logout-btn").addEventListener("click", function() {
  alert("Sesión cerrada correctamente.");
  window.location.href = "index.html";
});
