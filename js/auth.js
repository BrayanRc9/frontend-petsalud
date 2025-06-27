document.getElementById("btn-registrar").addEventListener("click", async () => {
  const nombre = document.getElementById("registro-nombre").value;
  const email = document.getElementById("registro-email").value;
  const password = document.getElementById("registro-password").value;
  const rol = document.getElementById("registro-rol").value;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password, rol })
  });

  const data = await res.json();
  alert(data.msg);
});

document.getElementById("btn-login").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "mis-mascotas.html";
  } else {
    alert(data.msg || "Inicio de sesión fallido.");
  }
});