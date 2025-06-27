import { jsPDF } from "jspdf";

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();

  document.getElementById("form-historia").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("mascota-nombre").value;
    const fecha = document.getElementById("fecha").value;
    const sintomas = document.getElementById("sintomas").value;
    const diagnostico = document.getElementById("diagnostico").value;
    const tratamiento = document.getElementById("tratamiento").value;

    // Buscar mascota
    const resMascotas = await fetch(`${API_URL}/mascotas`, {
      headers: { Authorization: token }
    });
    const mascotas = await resMascotas.json();
    const mascota = mascotas.find(m => m.nombre === nombre);
    if (!mascota) return alert("Mascota no encontrada.");

    // Generar PDF
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Fecha: ${fecha}`, 10, 10);
    doc.text(`Nombre Mascota: ${nombre}`, 10, 20);
    doc.text("Síntomas:", 10, 30);
    doc.text(sintomas, 10, 40);
    doc.text("Diagnóstico:", 10, 60);
    doc.text(diagnostico, 10, 70);
    doc.text("Tratamiento:", 10, 90);
    doc.text(tratamiento, 10, 100);

    const pdfBlob = doc.output("blob");
    const formData = new FormData();
    formData.append("historia", pdfBlob, `${nombre}_${fecha}.pdf`);
    formData.append("mascotaId", mascota._id);

    const res = await fetch(`${API_URL}/historias`, {
      method: "POST",
      headers: { Authorization: token },
      body: formData
    });

    const data = await res.json();
    alert(data.msg || "Historia registrada exitosamente");
    document.getElementById("form-historia").reset();
    cargarHistorias();
  });

  async function cargarHistorias() {
    const res = await fetch(`${API_URL}/historias`, {
      headers: { Authorization: token }
    });
    const historias = await res.json();
    const lista = document.getElementById("lista-historias");
    lista.innerHTML = "";

    historias.forEach(h => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${API_URL}/historias/ver/${h.nombre}" target="_blank">${h.nombre}</a>`;
      lista.appendChild(li);
    });
  }

  cargarHistorias();
});
