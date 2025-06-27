document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();

  const res = await fetch(`${API_URL}/mascotas`, {
    headers: { Authorization: token }
  });

  const mascotas = await res.json();
  const lista = document.getElementById("lista-mis-mascotas");
  lista.innerHTML = "";

  mascotas.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `${m.nombre} - ${m.especie}, ${m.edad} años`;
    lista.appendChild(li);
  });
});