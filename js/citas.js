document.getElementById("form-cita").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = getToken();
  const nombreMascota = document.getElementById("cita-mascota").value;
  const fecha = document.getElementById("cita-fecha").value;
  const hora = document.getElementById("cita-hora").value;

  const resMascotas = await fetch(`${API_URL}/mascotas`, {
    headers: { Authorization: token }
  });
  const mascotas = await resMascotas.json();
  const mascota = mascotas.find(m => m.nombre === nombreMascota);
  if (!mascota) return alert("Mascota no encontrada");

  const res = await fetch(`${API_URL}/citas`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mascotaId: mascota._id, fecha, hora })
  });

  const data = await res.json();
  alert(data.msg);
});