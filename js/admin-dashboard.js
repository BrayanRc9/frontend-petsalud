
document.addEventListener("DOMContentLoaded", () => {
  const listaInsumos = document.getElementById("lista-insumos");
  const insumos = [
    { nombre: "Vacuna Antirrábica", cantidad: 12 },
    { nombre: "Guantes quirúrgicos", cantidad: 50 }
  ];

  insumos.forEach(insumo => {
    const li = document.createElement("li");
    li.textContent = `${insumo.nombre} - ${insumo.cantidad} unidades`;
    listaInsumos.appendChild(li);
  });

  document.getElementById("form-usuario").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Usuario médico creado.");
  });

  document.getElementById("form-insumo").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Insumo agregado al inventario.");
  });
});
