#!/usr/bin/env node

const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const path = require('path');

async function addMargin(inputPath, marginSize = 50) {
  const existingPdfBytes = fs.readFileSync(inputPath);
  const existingPdfDoc = await PDFDocument.load(existingPdfBytes);
  const pdfDoc = await PDFDocument.create();
  const pages = existingPdfDoc.getPages();

  for (const page of pages) {
    const embeddedPage = await pdfDoc.embedPage(page);
    const { width, height } = page.getSize();
    const newWidth = width + 2 * marginSize;
    const newHeight = height + 2 * marginSize;

    const newPage = pdfDoc.addPage([newWidth, newHeight]);

    newPage.drawPage(embeddedPage, {
      x: marginSize,
      y: marginSize,
      width,
      height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(inputPath, pdfBytes);
}

const inputPdf = process.argv[2];

if (!inputPdf) {
  console.error('Usage: pdf-margin <file.pdf>');
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputPdf);

addMargin(inputPath)
  .then(() => console.log(`Added margin to ${inputPdf}`))
  .catch(err => console.error(`Failed to process PDF: ${err}`));
