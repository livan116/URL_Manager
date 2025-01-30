import React, { useEffect, useState } from "react";
import styles from "./Links.module.css";
import axios from "axios";
import { toast } from 'react-toastify';
import { useAppContext } from '../../components/AppContext';
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../Pagination/Pagination";

const Links = () => {
  let [links, setLinks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isExpirationEnabled, setIsExpirationEnabled] = useState(false);
  const { showCreateForm, setShowCreateForm,searchTerm } = useAppContext();
  const [createUrl, setCreateUrl] = useState({
    originalUrl: "",
    remarks: "",
    expirationDate: null
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fetchLinks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/url?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setLinks(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Error fetching links");
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [currentPage]);

  const handleCreateUrl = (e) => {
    const { name, value } = e.target;
    setCreateUrl(prev => ({ ...prev, [name]: value }));
  };

  // search functionality
  links = links.filter((item) =>
    item.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExpirationToggle = (e) => {
    setIsExpirationEnabled(e.target.checked);
    if (!e.target.checked) {
      setCreateUrl(prev => ({ ...prev, expirationDate: null }));
      setSelectedDate(new Date());
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCreateUrl(prev => ({ ...prev, expirationDate: date }));
    setShowDatePicker(false);
  };

  const handleCreateUrlSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        originalUrl: createUrl.originalUrl,
        remarks: createUrl.remarks,
        expirationDate: isExpirationEnabled ? selectedDate : null
      };

      await axios.post('http://localhost:5000/api/url/shorten',
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("URL created successfully");
      resetForm();
      fetchLinks();
    } catch (error) {
      toast.error("Error creating URL");
    }
  };

  const handleUpdateCreateUrl = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        originalUrl: createUrl.originalUrl,
        remarks: createUrl.remarks,
        expirationDate: isExpirationEnabled ? selectedDate : null
      };

      await axios.put(`http://localhost:5000/api/url/${currentId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("URL updated successfully");
      resetForm();
      fetchLinks();
    } catch (error) {
      toast.error("Error updating URL");
    }
  };

  const updateId = (item) => {
    setIsEditing(true);
    setCurrentId(item._id);
    setCreateUrl({
      originalUrl: item.originalUrl,
      remarks: item.remarks,
      expirationDate: item.expirationDate
    });
    setIsExpirationEnabled(!!item.expirationDate);
    if (item.expirationDate) {
      setSelectedDate(new Date(item.expirationDate));
    }
    setShowCreateForm(true);
  };

  const deleteUrl = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/url/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLinks(prev => prev.filter(url => url._id !== id));
      toast.success("URL deleted successfully");
    } catch (error) {
      toast.error("Error deleting URL");
    }
  };

  const resetForm = () => {
    setCreateUrl({ originalUrl: "", remarks: "", expirationDate: null });
    setIsEditing(false);
    setShowCreateForm(false);
    setCurrentId(null);
    setIsExpirationEnabled(false);
    setSelectedDate(new Date());
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied successfully!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Links</h1>
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
            {links.map((item) => (
              <tr key={item._id} className={styles.tableRow}>
                <td>{formatDate(item.createdAt)}</td>
                <td><div className={styles.original}>{item.originalUrl}</div></td>
                <td className={styles.shortEdit}>
                  <div className={styles.short}>{item.shortUrl}</div>
                  <span className={styles.copyIcon} onClick={() => handleCopy(item.shortUrl)}>📋</span>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {showCreateForm && (
        <div className={styles.createLinkModel}>
          <div className={styles.Createlinks_container}>
            <div className={styles.createLinkhead}>
              <span className={styles.newSpan}>{isEditing ? 'Edit Link' : 'New Link'}</span>
              <span className={styles.crossSpan} onClick={resetForm}>X</span>
            </div>
            <form onSubmit={isEditing ? handleUpdateCreateUrl : handleCreateUrlSubmit} className={styles.create_form}>
              <div className={styles.Urlinput}>
                <label htmlFor="originalUrl">Destination URL <span>*</span></label>
                <input
                  type="text"
                  name="originalUrl"
                  value={createUrl.originalUrl}
                  onChange={handleCreateUrl}
                  placeholder='https://web.whatsapp.com/'
                  required
                />
              </div>
              <div className={styles.Urlinput}>
                <label htmlFor="remarks">Remarks <span>*</span></label>
                <textarea
                  name="remarks"
                  value={createUrl.remarks}
                  onChange={handleCreateUrl}
                  placeholder='Add remarks'
                  required
                />
              </div>

              <div className={styles.toggle}>
                <p>Link Expiration</p>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={isExpirationEnabled}
                    onChange={handleExpirationToggle}
                  />
                  <span className={`${styles.slider} ${styles.round}`}></span>
                </label>
              </div>

              {isExpirationEnabled && (
                <div className={styles.date_time_container}>
                  <input
                    type="text"
                    value={formatDate(selectedDate)}
                    readOnly
                    className={styles.date_display}
                  />
                  <FiCalendar
                    className={styles.calendar_icon}
                    onClick={() => setShowDatePicker(prev => !prev)}
                  />
                  {showDatePicker && (
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      showTimeSelect
                      dateFormat="Pp"
                      minDate={new Date()}
                      inline
                      className={styles.datepicker}
                    />
                  )}
                </div>
              )}

              <div className={styles.createUrl_Btns}>
                <button type="button" className={styles.clearBtn} onClick={resetForm}>
                  Clear
                </button>
                <button type="submit" className={styles.createBtn}>
                  {isEditing ? 'Save' : 'Create new'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Links;