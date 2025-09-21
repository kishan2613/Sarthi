import { useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import TicketSVG from "../assets/Ticket.svg"; // adjust path

export default function Ticket({ fullName, numberOfPeople, date, slot, autoDownload = false }) {
  const ticketRef = useRef();

  // Download Ticket as PDF (exact ticket size, no white space)
  const handleDownload = async () => {
    const element = ticketRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    // set PDF size to match the ticket dimensions
    const pdfWidth = canvas.width;
    const pdfHeight = canvas.height;

    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "px",
      format: [pdfWidth, pdfHeight], // custom size = ticket size
    });

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("ticket.pdf");
  };

  // Auto download when booking confirmed
  useEffect(() => {
    if (autoDownload) {
      handleDownload();
    }
  }, [autoDownload]);

  return (
    <div className="flex flex-col items-center ">
      {/* Ticket Container */}
      <div ref={ticketRef} className="relative ">
        {/* Background Ticket SVG */}
        <img src={TicketSVG} alt="Ticket" className="w-full" />

        {/* Dynamic Details */}
        <div
          className="absolute top-[50%] left-[78%] text-gray-800"
          style={{
            transform: "rotate(-90deg) translate(-50%, -50%)",
            transformOrigin: "left top",
            fontSize: "10px",
            lineHeight: "12px",
          }}
        >
          <p>
            <span className="font-bold">Name:</span> {fullName}
          </p>
          <p>
            <span className="font-semibold">Persons:</span> {numberOfPeople}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Slot:</span> {slot}
          </p>
        </div>
      </div>

      {/* Manual Download Button */}
      {!autoDownload && (
        <button
          onClick={handleDownload}
          className="mt-6 bg-gradient-to-r from-orange-500 to-purple-600 text-white px-6 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          Download Ticket
        </button>
      )}
    </div>
  );
}
