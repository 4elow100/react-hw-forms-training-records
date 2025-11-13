import {useRef, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faX} from "@fortawesome/free-solid-svg-icons"

export default function TrainingRecords() {
  const [records, setRecords] = useState([]);

  const dateRef = useRef(null);
  const countRef = useRef(null);

  const validDate = (date) => {
    const dateStr = date.trim();

    if (!/^(\d{2})\.(\d{2})\.(\d{4})$/.test(dateStr)) return null;

    const [day, month, year] = dateStr.split(".").map(Number);

    if (
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1 ||
      year > 9999
    )
      return null;

    return new Date(year, month - 1, day);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());

    return `${day}.${month}.${year}`;
  };

  const handleAddRecord = (e) => {
    e.preventDefault();

    const recDateStr = dateRef.current.value;
    const recDate = validDate(recDateStr);

    if (!recDate) {
      dateRef.current.style.backgroundColor = "red";
      return;
    } else {
      dateRef.current.style.backgroundColor = "white";
    }

    const recCount = parseFloat(countRef.current.value);
    if (!recCount) {
      countRef.current.style.backgroundColor = "red";
      return;
    } else {
      countRef.current.style.backgroundColor = "white";
    }


    const foundDate = records.find((record) => {
      return record.date.getTime() === recDate.getTime();
    });

    if (foundDate) {
      foundDate.count += recCount;
    } else {
      records.push({
        id: uuidv4(),
        date: recDate,
        count: recCount,
      });
    }

    setRecords((prev) =>
      [...prev].sort((a, b) => b.date.getTime() - a.date.getTime())
    );
  };

  const handleDeleteRecord = (e) => {
    const recElem = e.target.closest(".record");
    if (!recElem) return;

    const date = recElem.querySelector(".record-date");

    setRecords((prev) =>
      prev.filter((record) => formatDate(record.date) !== date.textContent)
    );
  };

  return (
    <>
      <form className="form-container" onSubmit={handleAddRecord}>
        <div className="date-form">
          <label className="form-label">Дата (ДД.ММ.ГГГГ)</label>
          <input className="date-input" type="text" ref={dateRef}/>
        </div>
        <div className="count-form">
          <label className="form-label">Пройдено км</label>
          <input className="count-input" type="text" ref={countRef}/>
        </div>
        <button type="submit">OK</button>
      </form>
      <div className="table-container">
        <div className="table-headers">
          <span className="table-header">Дата (ДД.ММ.ГГГГ)</span>
          <span className="table-header">Пройдено км</span>
          <span className="table-header">Действия</span>
        </div>
        <div className="table-body">
          <ul className="records-list">
            {records.map((record) => (
              <li key={record.id} className="record">
                <div className="record-date">{formatDate(record.date)}</div>
                <div className="record-count">{record.count}</div>
                <div className="record-actions">
                  <button className="record-edit" type="button">
                    <FontAwesomeIcon icon={faPencil} />
                  </button>
                  <button className="record-delete" type="button" onClick={handleDeleteRecord}>
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
