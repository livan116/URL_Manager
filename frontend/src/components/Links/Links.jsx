
// Frontend: Complete Links.js component
import React, { useEffect, useState, useCallback } from "react";
import styles from "./Links.module.css";
import axios from "axios";
import { toast } from 'react-toastify';
import { useAppContext } from '../../components/AppContext';
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../Pagination/Pagination";

const Links = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [links, setLinks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  // const [isExpirationEnabled, setIsExpirationEnabled] = useState(false);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState(null);
  const { showCreateForm, setShowCreateForm, searchTerm } = useAppContext();
  const [createUrl, setCreateUrl] = useState({
    originalUrl: "",
    remarks: "",
    expirationDate: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const isUrlExpired = useCallback((expirationDate) => {
    if (!expirationDate) return false;
    return new Date() > new Date(expirationDate);
  }, []);

  const getStatus = useCallback((url) => {
    if (url.status === 'Inactive') return 'Inactive';
    if (isUrlExpired(url.expirationDate)) return 'Inactive';
    return 'Active';
  }, [isUrlExpired]);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/url?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      
      const updatedLinks = response.data.data.map(link => ({
        ...link,
        status: getStatus(link)
      }));
      
      setLinks(updatedLinks);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      if(filteredLinks.length > 0){
        toast.error("Error fetching links");
      }
      
    }
  };

  useEffect(() => {
    fetchLinks();
    // Set up periodic refresh
    const interval = setInterval(fetchLinks, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [currentPage]);

  const handleToggleChange = (e) => {
    const isChecked = e.target.checked;
    setExpirationEnabled(isChecked);
    
    if (!isChecked) {
      setExpirationDate(null);
      setCreateUrl(prev => ({
        ...prev,
        expirationDate: null
      }));
    } else {
      const defaultDate = new Date();
      defaultDate.setHours(defaultDate.getHours() + 24); // Set default to 24 hours from now
      setExpirationDate(defaultDate);
      setSelectedDate(defaultDate);
      setCreateUrl(prev => ({
        ...prev,
        expirationDate: defaultDate
      }));
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    if (expirationEnabled) {
      setExpirationDate(date);
      setCreateUrl(prev => ({
        ...prev,
        expirationDate: date
      }));
    }
  };

  const handleCreateUrl = (e) => {
    const { name, value } = e.target;
    setCreateUrl(prev => ({ ...prev, [name]: value }));
  };

  const filteredLinks = links.filter((item) =>
    item.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleCreateUrlSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        originalUrl: createUrl.originalUrl,
        remarks: createUrl.remarks,
        expirationDate: expirationEnabled ? selectedDate : null
      };

      await axios.post(`${apiUrl}/api/url/shorten`,
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
        expirationDate: expirationEnabled ? selectedDate : null
      };

      const response = await axios.put(
        `${apiUrl}/api/url/${currentId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.data.status === 'Active') {
        toast.success("URL updated and activated successfully");
      } else {
        toast.success("URL updated successfully");
      }
      
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
    
    const hasExpiration = !!item.expirationDate;
    setExpirationEnabled(hasExpiration);
    
    if (hasExpiration) {
      const expDate = new Date(item.expirationDate);
      setSelectedDate(expDate);
      setExpirationDate(expDate);
    } else {
      const defaultDate = new Date();
      defaultDate.setHours(defaultDate.getHours() + 24);
      setSelectedDate(defaultDate);
    }
    
    setShowCreateForm(true);
  };

  const deleteID = (item) => {
    setDeleteId(item._id);
    setShowDeleteModel(true);
  };

  const deleteUrl = async () => {
    try {
      await axios.delete(`${apiUrl}/api/url/${deleteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLinks(prev => prev.filter(url => url._id !== deleteId));
      setShowDeleteModel(false);
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
    setShowDeleteModel(false);
    setDeleteId(null);
    setExpirationEnabled(false);
    setExpirationDate(null);
    setSelectedDate(new Date());
    setShowDatePicker(false);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied successfully!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const renderDatePicker = () => (
    <div className={styles.date_time_container}>
      <div className={styles.datePickerWrapper}>
        <input
          type="text"
          value={expirationDate ? formatDate(expirationDate) : ''}
          readOnly
          className={styles.date_display}
          onClick={() => setShowDatePicker(true)}
        />
        <FiCalendar
          className={styles.calendar_icon}
          onClick={() => setShowDatePicker(true)}
        />
      </div>
      {showDatePicker && (
        <div className={styles.datePickerPopup}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            inline
          />
        </div>
      )}
    </div>
  );

  return (
    <>
    {filteredLinks.length > 0 ? (<div className={styles.container}>

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
            {filteredLinks.map((item) => (
              <tr key={item._id} className={styles.tableRow}>
                <td className={styles.date}>{formatDate(item.createdAt)}</td>
                <td><div className={styles.original}>{item.originalUrl}</div></td>
                <td className={styles.shortEdit}>
                  <div className={styles.shortLink}><div className={styles.short}>{item.shortUrl}</div>
                  <div className={styles.copyIcon} onClick={() => handleCopy(item.shortUrl)}><i className="fa-regular fa-copy"></i></div></div>
                </td>
                <td className={styles.remarks}>{item.remarks}</td>
                <td ><div className={styles.clicks}>{item.totalClicks}</div></td>
                <td className={styles.status}>
                  <div className={item.status === 'Active' ? styles.active : styles.inactive}>
                    {item.status}
                  </div>
                </td>
                <td className={styles.btns}>
                  <button className={styles.editButton} onClick={() => updateId(item)}>
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className={styles.deleteButton} onClick={() => deleteID(item)}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showDeleteModel && (
        <div className={styles.overlay}>
          <div className={styles.delete_model}>
            <span onClick={resetForm}>x</span>
            <div className={styles.delete_content}>
              <p>Are you sure you want to remove it?</p>
              <div className={styles.deleteModel_Btns}>
                <button className={styles.noBtn} onClick={resetForm}>NO</button>
                <button className={styles.yesBtn} onClick={deleteUrl}>YES</button>
              </div>
            </div>
          </div>
        </div>
      )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      
    </div>):(<div><table className={styles.tableContainer}>
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
          <tbody >
           
            <div className={styles.noData}> No data available</div>
          </tbody></table>
          </div>)}
    {showCreateForm && (
        <div className={styles.overlays}>
          <div className={styles.createLinkModel}>
            <div className={styles.Createlinks_container}>
              <div className={styles.createLinkhead}>
                <span className={styles.newSpan}>{isEditing ? 'Edit Link' : 'New Link'}</span>
                <span className={styles.crossSpan} onClick={resetForm}>X</span>
              </div>
              <form onSubmit={isEditing ? handleUpdateCreateUrl : handleCreateUrlSubmit}>
                <div className={styles.input_style}>
                  <div className={styles.Urlinput}>
                    <label htmlFor="originalUrl">Destination Url <span>*</span></label>

                    <input type="text" name="originalUrl"
                      value={createUrl.originalUrl}
                      onChange={handleCreateUrl}
                      placeholder='https://web.whatsapp.com/'
                    />

                  </div>
                  <div className={styles.Urlinput}>
                    <label htmlFor="remarks">Remarks <span>*</span></label> <br />
                    <textarea name="remarks" id="remarks" value={createUrl.remarks} onChange={handleCreateUrl} placeholder='Add remarks' required>Add remarks</textarea>
                  </div>

                  <div className={styles.toggle}>
                    <p>Link Expiration</p>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={expirationEnabled}
                        onChange={handleToggleChange}
                      />
                      <span className={`${styles.slider} ${styles.round}`}></span>
                    </label>
                  </div>

                  {/* Date and Time Picker */}
                  {expirationEnabled ? (
                    <div className={styles.date_time_container}>
                      <input
                        type="text"
                        value={expirationDate ? formatDate(expirationDate) : ''}
                        readOnly
                        className="date_display"
                      />
                      <FiCalendar
                        className="calendar_icon"
                        onClick={() => setShowDatePicker((prev) => !prev)}
                      />
                      {showDatePicker && (
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => {
                            handleDateChange(date);
                            setShowDatePicker(false);
                          }}
                          showTimeSelect
                          dateFormat="Pp"
                          minDate={new Date()}
                          block
                          className="datepicker"
                        />
                      )}
                    </div>

                  ) :
                    (<div className={styles.emptyHeight}></div>)}
                </div>

                <div className={styles.createUrl_Btns}>
                  <div>
                    <p className={styles.clearBtn} onClick={resetForm}>Clear</p>
                  </div>
                  <div>
                    <button className={styles.createBtn} type='submit'> {isEditing ? 'Save' : 'Create new'}</button>

                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      
    </>
  );
};

export default Links;