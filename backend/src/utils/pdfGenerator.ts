import PDFDocument from "pdfkit";
import { Response } from "express";

export const generateResultPDF = (data: any, res: Response) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=result_${data.attempt.id}.pdf`);

  doc.pipe(res);

  doc.fontSize(25).text("Exam Result Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(16).text(`Exam: ${data.examTitle}`);
  doc.text(`Student: ${data.userName}`);
  doc.text(`Score: ${data.attempt.score}`);
  doc.text(`Date: ${new Date(data.attempt.submit_time).toLocaleDateString()}`);
  doc.moveDown();

  doc.fontSize(18).text("Question Details:");
  doc.moveDown();

  data.answers.forEach((ans: any, index: number) => {
    doc.fontSize(12).text(`${index + 1}. ${ans.question_text}`);
    doc.fillColor("blue").text(`Your Answer: ${ans.answer}`);
    doc.fillColor("green").text(`Correct Answer: ${ans.correct_answer}`);
    doc.fillColor("black").text(`Marks: ${ans.marks_awarded} / ${ans.max_marks}`);
    doc.moveDown();
  });

  doc.end();
};
