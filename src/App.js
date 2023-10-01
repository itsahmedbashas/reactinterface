import { useState, useEffect, useCallback } from "react";
import { BiCalendar } from "react-icons/bi";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";

function App() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderBy] = useState("asc");

  const filteredAppointments = appointmentList
    .filter((appt) => {
      return (
        appt.petName.toLowerCase().includes(query.toLowerCase()) ||
        appt.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        appt.aptNotes.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a, b) => {
      let order = orderBy === "asc" ? 1 : -1;
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order
        : 1 * order;
    });

  const fetchData = useCallback(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then(setAppointmentList);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleQueryChange = (val) => {
    setQuery(val);
  };

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-500" />
        Your's Appointment
      </h1>

      <AddAppointment
        lastId={appointmentList.reduce(
          (max, item) => (Number(item.id) > max ? Number(item.id) : max),
          0
        )}
        onApptAdd={(apptInfo) => {
          setAppointmentList([...appointmentList, apptInfo]);
        }}
      />
      <Search
        query={query}
        onQueryChange={handleQueryChange}
        orderBy={orderBy}
        onOrderByChange={setOrderBy}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <ul>
        {filteredAppointments.map((appointment) => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={(appointmentId) => {
              setAppointmentList(
                appointmentList.filter(
                  (appointment) => appointment.id !== appointmentId
                )
              );
            }}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
