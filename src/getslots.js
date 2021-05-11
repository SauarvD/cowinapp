import { useEffect, useState } from "react";
import axios from "axios";
import logo from "./vaccine_image.png";

const MINUTE_MS = 60000;

export default function Getslots() {
  const [number, setPhoneNumber] = useState("");
  const [submitted, setData] = useState(false);

  const startCron = () => {
    setData(true);
    getvaccineslots();
    const interval = setInterval(() => {
      getvaccineslots();
    }, MINUTE_MS);

    return () => clearInterval(interval);
  };

  /**
   * function to send the phone number and message to the server
   * @param {array} data
   */
  const testcall = data => {
    axios
      .post(`https://cowinbackend.herokuapp.com/findslots`, {
        phonenumber: number,
        data: data
      })
      .then(res => {
        console.log(res);
      })
      .catch(error => console.error(error));
  };

  /**
   * function to get the details of vaccination
   */
  const getvaccineslots = () => {
    let currentDate = new Date();
    currentDate = currentDate.toISOString().split("T")[0];
    currentDate = currentDate
      .split("-")
      .reverse()
      .join("-");

    axios
      .get(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=45&date=${currentDate}`
      )
      .then(res => {
        testcall(res.data.centers);
      })
      .catch(error => console.error(error));
  };
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        To get realtime notifications on your whatsapp regarding slots
        availability in Tinsukia district
      </p>
      <a
        className="App-link"
        href="https://api.whatsapp.com/send/?phone=%2B14155238886&text=join+speech-pencil&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
      >
        Click here
      </a>
      <p className="note">
        By sending the text on the number, you are allowing us to send
        updates on your whatspp number
      </p>
      <p>Once complete, enter your phone number to get started</p>
      {!submitted && (
        <div className="input-wrapper">
          <input
            type="text"
            value={number}
            onChange={event => setPhoneNumber(event.target.value)}
          />
          <button onClick={startCron}>Submit</button>
        </div>
      )}
      {submitted && (
        <div className="input-wrapper">
          Sending you the updates...
        </div>
      )}
    </header>
  );
}
