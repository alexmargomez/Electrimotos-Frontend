import React, { useEffect } from 'react';

const FactuPrint = ({ id }) => {
  const token = localStorage.getItem('authToken');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log('FactuPrint:', id);

    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${API_URL}/invoices/pdf/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Verificar si la ventana fue bloqueada por el navegador
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
          // Usar una bandera para evitar la doble ejecución de "onload"
          let printed = false;

          printWindow.document.write(
            `<iframe src="${url}" frameborder="0" style="border:0; width:100%; height:100%;" allowfullscreen></iframe>`
          );
          printWindow.document.close();

          printWindow.onload = () => {
            if (!printed) {
              printWindow.print(); // Imprimir una vez
              printed = true; // Evitar futuras impresiones duplicadas

              setTimeout(() => {
                printWindow.close(); // Cerrar después de imprimir
              }, 1000); // Esperar un segundo antes de cerrar
            }
          };
        } else {
          console.error('No se pudo abrir la ventana de impresión.');
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
      }
    };

    fetchInvoices();
  }, [id, token, API_URL]);

  return null;
};

export default FactuPrint;
