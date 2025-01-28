import PDFDocument from 'pdfkit';
const generatePDF = (data:any, title: string): Buffer => {
 const doc = new PDFDocument();
 const buffers: Buffer[] = [];
 doc.on('data', buffers.push.bind(buffers));
 doc.on('end', () => {});
 doc.fontSize(20).text(title, {align: 'center'});
 doc.moveDown();
 doc.fontSize(12);
 data.forEach((item:any) => {
    doc.text(JSON.stringify(item, null, 2));
    doc.moveDown();
 });
 doc.end();
 return Buffer.concat(buffers);
}

export default generatePDF;
