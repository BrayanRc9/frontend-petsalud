function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("🔒 Acceso denegado. Debes iniciar sesión.");
    window.location.href = "auth.html";
  }
  return token;
}
