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
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Abrir el PDF en una nueva ventana emergente
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(
          `<iframe src="${url}" frameborder="0" style="border:0; width:100%; height:100%;" allowfullscreen></iframe>`
        );
        printWindow.document.close();

        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      } catch (error) {
        console.error('Error fetching invoice:', error);
      }
    };
    fetchInvoices();
  }, [id, token, API_URL]);

  return null;
};

export default FactuPrint;