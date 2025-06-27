
document.addEventListener("DOMContentLoaded", () => {
  // Simulación de datos
  const mascotas = [
    { nombre: "Max", especie: "Perro", edad: 3 },
    { nombre: "Luna", especie: "Gato", edad: 5 }
  ];

  const historias = [
    { nombre: "Historia_Max.pdf", url: "#" },
    { nombre: "Historia_Luna.pdf", url: "#" }
  ];

  const container = document.getElementById("mascotas-container");
  mascotas.forEach(mascota => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${mascota.nombre}</h3>
      <p>Especie: ${mascota.especie}</p>
      <p>Edad: ${mascota.edad} años</p>
    `;
    container.appendChild(card);
  });

  const lista = document.getElementById("historias-list");
  historias.forEach(historia => {
    const item = document.createElement("li");
    item.innerHTML = `<a href="${historia.url}" target="_blank">${historia.nombre}</a>`;
    lista.appendChild(item);
  });

  document.getElementById("form-cita").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Cita agendada exitosamente.");
    // Aquí se enviaría al backend
  });
});
