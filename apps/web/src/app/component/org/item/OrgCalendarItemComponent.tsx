import { Calendar } from "@pld/shared";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { ClickableTile } from "carbon-components-react";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  calendar: Calendar;
};

export const OrgCalendarItemComponent = (props: Props) => {

  const navigate = useNavigate();

  return (
    <ClickableTile style={{borderRadius: 10}} onClick={() => navigate(`calendar/${props.calendar._id}`)}>
      <h4 style={{fontWeight: 600, fontSize: 26}}>{props.calendar.name}</h4>
      <p>{props.calendar.description}</p>
      <FullCalendar
        aspectRatio={3}
        headerToolbar={{start: '', right: '', end: '', center: '', left: ''}}
        locale={'fr'}
        plugins={[ dayGridPlugin ]}
        initialView="dayGridMonth"
      />
    </ClickableTile>
  );
};
