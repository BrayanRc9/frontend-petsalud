
document.addEventListener("DOMContentLoaded", () => {
  const pacientes = [
    { nombre: "Rocky", especie: "Perro", edad: 4 },
    { nombre: "Nala", especie: "Gata", edad: 2 }
  ];
  const lista = document.getElementById("lista-pacientes");
  pacientes.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - ${p.especie}, ${p.edad} años`;
    lista.appendChild(li);
  });
});
        