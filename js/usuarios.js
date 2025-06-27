document.getElementById("form-usuario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("usuario-nombre").value;
  const email = document.getElementById("usuario-email").value;
  const rol = document.getElementById("usuario-rol").value;
  const password = "123456";

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password, rol })
  });

  const data = await res.json();
  alert(data.msg);
});