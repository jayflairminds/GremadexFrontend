import { Button, Modal } from 'antd';
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './SummarizeModal.module.css';

export const SummarizeModal = ({ isSummaryModal, setIsSummaryModal, summaryResponse }) => {
  const handleCancel = () => {
    setIsSummaryModal(false);
  };

  const handleExportPDF = () => {
    const input = document.getElementById('summaryContent');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('summary.pdf');
    });
  };

  return (
    <div>
      <Modal
        open={isSummaryModal}
        title=""
        onCancel={handleCancel}
        width={1000}
        centered
        footer={[
          <Button key="export" onClick={handleExportPDF}>
            Export to PDF
          </Button>,
        ]}
      >
        <div id="summaryContent" className={styles.main}>
          <div
            className={styles.summaryMeesage}
            dangerouslySetInnerHTML={{ __html: summaryResponse }}
          />
        </div>
      </Modal>
    </div>
  );
};
