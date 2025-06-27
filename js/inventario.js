document.getElementById("form-insumo").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = getToken();
  const nombre = document.getElementById("insumo-nombre").value;
  const cantidad = parseInt(document.getElementById("insumo-cantidad").value);

  const res = await fetch(`${API_URL}/inventario`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nombre, cantidad })
  });

  const data = await res.json();
  alert(data.msg);
});