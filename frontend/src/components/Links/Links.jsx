import React, { useEffect, useState } from "react";
import styles from "./Links.module.css";
import axios from "axios";
import { toast } from 'react-toastify';
// import { useOutletContext } from 'react-router-dom';
import { useAppContext } from '../../components/AppContext';

import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";

const Links = () => {
  const [links, setLinks] = useState([]);
   // usestate for date and time handle
   const [selectedDate, setSelectedDate] = useState(new Date());
   const [showDatePicker, setShowDatePicker] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
 
   const { showCreateForm } = useAppContext();
 
 
   const [createUrl, setCreateUrl] = useState({
     originalUrl: "",
     remarks: "",
   });

   const handleCreateUrl = (e) => {
    const { name, value } = e.target;
    setCreateUrl({ ...createUrl, [name]: value })
  }

  const handleCreateUrlSubmit = async (e) => {
    e.preventDefault();

    console.log("kumar")
    try {
      const response = await axios.post('http://localhost:5000/api/url/shorten',
        {
          originalUrl: createUrl.originalUrl,
          remarks: createUrl.remarks,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log(response.data)

      if (response.data.success) {
        toast.success("Url created successfully");
      }


    } catch (error) {
      console.log("error in creating url:", error)
      toast.error("error in creating url")
    }

  };

  const updateId = (item) => {
    setIsEditing(true);

    console.log(item.originalUrl)
    setCreateUrl({
      originalUrl: item.originalUrl,
      remarks: item.remarks,
      id: item._id
    })
  };

  const handleUpdateCreateUrl = async (id) => {
    // e.preventDefault();
    console.log(id)
    try {
      const response = await axios.put(`http://localhost:5000/api/url/${id}`,
        {
          originalUrl: createUrl.originalUrl,
          remarks: createUrl.remarks,

        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response)
      if (response.data.success) {
        toast.success("Url updated successfully")
      }
      setIsEditing(false);
    } catch (error) {
      console.log("error in updating the Url", error);
      toast.error("Error updating the Url")
    }
  };


  // Format the date and time
  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  // create new url end

  // deleting the url 
  const deleteUrl = async (id) => {
    // setLinkId(id)
    console.log(id)
    try {
      await axios.delete(`http://localhost:5000/api/url/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      // Remove deleted folder from the list
      const updatedDashboardLink = links.filter((url) => url._id !== id)
      setLinks(updatedDashboardLink);// Update the state
      //  setConfirmDeleteModel(false);
      toast.success("Url deleted successfully");
    }
    catch (error) {
      console.error("Error deleting Url:", error);
      toast.error("Error deleting Url");
    }
  };

  useEffect(() => {
    urlData();
    console.log("links:", links);
  }, []);

  const urlData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/url", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(response);
      setLinks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>links</h1>
      <div className={styles.linksContainer}>
      <table className={styles.tableContainer}>
  <thead className={styles.tableHeader}>
    <tr>
      <th>Date</th>
      <th className={styles.originalLink}>Original Link</th>
      <th className={styles.shortLink}>Short Link</th>
      <th>Remarks</th>
      <th>Clicks</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {links.map((item, index) => (
      <tr key={index} className={styles.tableRow}>
        <td>{new Date(item.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}</td>
        <td><div className={styles.original}>{item.originalUrl}</div></td>
        <td className={styles.shortEdit}>
         <div className={styles.short}> {item.shortUrl}
         </div>
         <span className={styles.copyIcon}>📋</span>
        </td>
        <td className={styles.remarks}>{item.remarks}</td>
        <td className={styles.clicks}>{item.totalClicks}</td>
        <td className={styles.status}>
          <span className={item.status === 'Active' ? styles.active : styles.inactive}>
            {item.status}
          </span>
        </td>
        <td className={styles.btns}>
          <button className={styles.editButton} onClick={() => updateId(item)}>
          <i className="fa-solid fa-pen"></i>
          </button>
          <button className={styles.deleteButton} onClick={() => deleteUrl(item._id)}>
          <i className="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>

      {isEditing ? (
        <div className={styles.Createlinks_container}>
          <form onSubmit={() => handleUpdateCreateUrl(createUrl.id)}>
            <div className={styles.destination_input}>
              <label htmlFor="originalUrl">Destination Url <span>*</span></label> <br />
              <input type="text" name="originalUrl" value={createUrl.originalUrl} onChange={handleCreateUrl} placeholder='https://web.whatsapp.com/'

              />
            </div>
            <div className={styles.remarks_input}>
              <label htmlFor="remarks">Remarks <span>*</span></label> <br />
              <textarea name="remarks" id="remarks" value={createUrl.remarks} onChange={handleCreateUrl}>Add remarks</textarea>
            </div>

            <div className={styles.toggle}>
              <p>Link Expiration</p>
              <p>toggle</p>
            </div>
            {/* Date and Time Picker */}
            <div className="date_time_container">
              <div className="date_time_display">
                {/* Display formatted date */}
                <input
                  type="text"
                  value={formatDate(selectedDate)}
                  readOnly
                  className="date_display"
                />
                {/* Calendar icon to toggle DatePicker */}
                <FiCalendar
                  className="calendar_icon"
                  onClick={() => setShowDatePicker((prev) => !prev)}
                />
              </div>

              {showDatePicker && (
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    // setShowDatePicker(false); // Close the calendar after selecting a date
                  }}
                  // showTimeSelect
                  dateFormat="Pp"
                  minDate={new Date()}
                  inline // Show inline calendar
                  className="datepicker"
                />
              )}
            </div>

            <div className={styles.createUrl_Btns}>
              <button className={styles.createBtn} type='submit'>Save</button>
              <button className={styles.clearBtn}>Clear</button>
            </div>
          </form>

        </div>
      ) : 
      <div>
      {showCreateForm &&(

        <div className={styles.Createlinks_container}>
          <form onSubmit={handleCreateUrlSubmit}>
            <div className={styles.destination_input}>
              <label htmlFor="originalUrl">Destination Url <span>*</span></label> <br />
              <input type="text" name="originalUrl" value={createUrl.originalUrl} onChange={handleCreateUrl} placeholder='https://web.whatsapp.com/'

              />
            </div>
            <div className={styles.remarks_input}>
              <label htmlFor="remarks">Remarks <span>*</span></label> <br />
              <textarea name="remarks" id="remarks" value={createUrl.remarks} onChange={handleCreateUrl}>Add remarks</textarea>
            </div>

            <div className={styles.toggle}>
              <p>Link Expiration</p>
              <p>toggle</p>
            </div>
            {/* Date and Time Picker */}
            <div className="date_time_container">
              <div className="date_time_display">
                {/* Display formatted date */}
                <input
                  type="text"
                  value={formatDate(selectedDate)}
                  readOnly
                  className="date_display"
                />
                {/* Calendar icon to toggle DatePicker */}
                <FiCalendar
                  className="calendar_icon"
                  onClick={() => setShowDatePicker((prev) => !prev)}
                />
              </div>

              {showDatePicker && (
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    // setShowDatePicker(false); // Close the calendar after selecting a date
                  }}
                  // showTimeSelect
                  dateFormat="Pp"
                  minDate={new Date()}
                  inline // Show inline calendar
                  className="datepicker"
                />
              )}
            </div>

            <div className={styles.createUrl_Btns}>
              <button className={styles.createBtn} type='submit'>Create new</button>
              <button className={styles.clearBtn}>Clear</button>
            </div>
          </form>

        </div>
      )}
      </div>

    }
    </div>
  );
};

export default Links;
