import React, { useEffect, useState } from "react";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/queue");
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-8 text-lg text-gray-400 animate-pulse">
        Loading bookings...
      </p>
    );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
        All Bookings
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              {[
                "#",
                "Ticket ID",
                "Temple",
                "Name",
                "Phone",
                "Persons",
                "Date",
                "Gate",
                "Created At",
              ].map((heading) => (
                <th
                  key={heading}
                  className="p-3 text-left font-semibold uppercase tracking-wide border-b border-gray-700"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b, i) => (
                <tr
                  key={b._id}
                  className={`text-gray-100 hover:bg-gray-800 transition-colors ${
                    i % 2 === 0 ? "bg-gray-900" : "bg-gray-950"
                  }`}
                >
                  <td className="p-3 border-b border-gray-700">{i + 1}</td>
                  <td className="p-3 border-b border-gray-700 font-mono text-sm">
                    {b.ticketId}
                  </td>
                  <td className="p-3 border-b border-gray-700">{b.templeName}</td>
                  <td className="p-3 border-b border-gray-700">{b.name}</td>
                  <td className="p-3 border-b border-gray-700">
                    {b.phone.replace(/(\d{2})(\d{5})(\d{5})/, "+$1-$2-$3")}
                  </td>
                  <td className="p-3 border-b border-gray-700">{b.persons}</td>
                  <td className="p-3 border-b border-gray-700">
                    {new Date(b.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-3 border-b border-gray-700 text-center">
                    <span className="inline-block px-3 py-1 rounded-xl bg-blue-600 text-white font-medium text-sm">
                        {b.gateNumber}
                    </span>
                    </td>

                  <td className="p-3 border-b border-gray-700">
                    {new Date(b.createdAt).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="p-4 text-center text-gray-400 font-medium"
                >
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;
