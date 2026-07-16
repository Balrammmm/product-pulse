"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import type { ReportPayload } from "@/lib/sampleData";
import { Toast } from "./Toast";

export function PDFExportButton({ report }: { report: ReportPayload }) {
  const [toast, setToast] = useState("");

  function exportPdf() {
    setToast("PDF export started.");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    let y = 52;

    const addHeading = (text: string) => {
      if (y > 720) {
        doc.addPage();
        y = 52;
      }
      doc.setTextColor(49, 89, 70);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(text, margin, y);
      y += 22;
      doc.setTextColor(31, 37, 35);
    };

    const addText = (text: string, size = 10) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, width);
      lines.forEach((line: string) => {
        if (y > 760) {
          doc.addPage();
          y = 52;
        }
        doc.text(line, margin, y);
        y += size + 6;
      });
      y += 6;
    };

    doc.setFillColor(31, 37, 35);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 112, "F");
    doc.setTextColor(251, 250, 247);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ProductPulse Strategy Memo", margin, y);
    y += 30;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`${report.productName} | ${report.totalReviews} reviews analyzed`, margin, y);
    y = 146;
    doc.setTextColor(31, 37, 35);

    addHeading("Top line");
    addText(
      `Average rating: ${
        report.averageRating ? `${report.averageRating}/5` : "Not provided"
      } | Positive ${report.analysis.sentiment.positive}% | Neutral ${report.analysis.sentiment.neutral}% | Negative ${report.analysis.sentiment.negative}%`,
    );

    addHeading("Executive summary");
    addText(report.analysis.summary, 11);

    addHeading("Sentiment");
    addText(
      `Positive ${report.analysis.sentiment.positive}% | Neutral ${report.analysis.sentiment.neutral}% | Negative ${report.analysis.sentiment.negative}%`,
    );

    addHeading("Pain points");
    report.analysis.pain_points.forEach((item, index) => {
      addText(`- ${item}`);
      const evidence = report.analysis.evidence_snippets?.[index];
      if (evidence) addText(`  Evidence: "${evidence}"`, 9);
    });
    if (report.analysis.evidence_snippets?.length && report.analysis.evidence_snippets.length > report.analysis.pain_points.length) {
      addHeading("Additional evidence snippets");
      report.analysis.evidence_snippets
        .slice(report.analysis.pain_points.length)
        .forEach((item) => addText(`- "${item}"`));
    }

    addHeading("Loved features");
    report.analysis.loved_features.forEach((item) => addText(`- ${item}`));

    addHeading("Feature requests");
    report.analysis.feature_requests.forEach((item) => addText(`- ${item}`));

    addHeading("Recommendations");
    report.analysis.recommendations.forEach((rec) => {
      const priority = rec.priority === "High" ? "P0" : rec.priority === "Medium" ? "P1" : "P2";
      addText(`${priority} - ${rec.title}`, 11);
      addText(`Reason: ${rec.reason}`);
      addText(`Impact: ${rec.impact}`);
      if (rec.evidence) addText(`Evidence: "${rec.evidence}"`);
      if (rec.confidence || rec.frequency) {
        addText(
          `Confidence: ${rec.confidence ?? "n/a"}%${
            rec.frequency ? ` | Review frequency: ${rec.frequency}` : ""
          }`,
        );
      }
    });

    addHeading("Roadmap");
    addText(`P0 Now: ${report.analysis.roadmap.now.join("; ")}`);
    addText(`P1 Next: ${report.analysis.roadmap.next.join("; ")}`);
    addText(`P2 Later: ${report.analysis.roadmap.later.join("; ")}`);

    doc.save(`productpulse-${report.productName || "report"}.pdf`);
  }

  return (
    <>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <button
        onClick={exportPdf}
        className="btn-primary rounded-full px-5 py-3 text-sm font-semibold"
        type="button"
      >
        <span className="relative z-10">Export PDF</span>
      </button>
    </>
  );
}
