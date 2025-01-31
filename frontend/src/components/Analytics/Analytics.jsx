import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./Analytics.module.css";
import Pagination from "../Pagination/Pagination";

const Analytics = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAnalyticsData();
  }, [currentPage]);

  const formatDateTime = (date, clickedAt) => {
    try {
      // Format the date part
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Format the time part if clickedAt exists
      let formattedTime = "";
      if (clickedAt) {
        formattedTime = new Date(clickedAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }

      // Combine date and time
      return `${formattedDate}${formattedTime ? ', ' + formattedTime : ''}`;
    } catch (error) {
      console.error("DateTime formatting error:", error);
      return "Invalid DateTime";
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/url?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const urls = response.data.data;
      const allLogs = [];

      urls.forEach((urlItem) => {
        if (urlItem.accessLogs && urlItem.accessLogs.length > 0) {
          // Group access logs by date
          const logsByDate = urlItem.accessLogs.reduce((acc, log) => {
            const logDate = new Date(log.clickedAt).toISOString().split('T')[0];
            if (!acc[logDate]) {
              acc[logDate] = [];
            }
            acc[logDate].push(log);
            return acc;
          }, {});

          // Match access logs with clicksPerDay data
          if (urlItem.clicksPerDay && urlItem.clicksPerDay.length > 0) {
            urlItem.clicksPerDay.forEach((clickData) => {
              const dateAccessLogs = logsByDate[clickData.date] || [];
              
              if (dateAccessLogs.length > 0) {
                // Create entries for each access log on this date
                dateAccessLogs.forEach((log) => {
                  allLogs.push({
                    date: clickData.date,
                    clicks: clickData.count,
                    originalUrl: urlItem.originalUrl,
                    shortUrl: urlItem.shortUrl,
                    ipAddress: log.ipAddress || "N/A",
                    deviceType: log.deviceType || "N/A",
                    clickedAt: log.clickedAt,
                  });
                });
              } else {
                // Create a single entry for dates without access logs
                allLogs.push({
                  date: clickData.date,
                  clicks: clickData.count,
                  originalUrl: urlItem.originalUrl,
                  shortUrl: urlItem.shortUrl,
                  ipAddress: "N/A",
                  deviceType: "N/A",
                  clickedAt: null,
                });
              }
            });
          }
        } else if (urlItem.clicksPerDay && urlItem.clicksPerDay.length > 0) {
          // Handle cases where there are clicks but no access logs
          urlItem.clicksPerDay.forEach((clickData) => {
            allLogs.push({
              date: clickData.date,
              clicks: clickData.count,
              originalUrl: urlItem.originalUrl,
              shortUrl: urlItem.shortUrl,
              ipAddress: "N/A",
              deviceType: "N/A",
              clickedAt: null,
            });
          });
        }
      });

      // Sort logs by date and time in descending order
      allLogs.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateB - dateA === 0 && a.clickedAt && b.clickedAt) {
          return new Date(b.clickedAt) - new Date(a.clickedAt);
        }
        return dateB - dateA;
      });

      setLogs(allLogs);
      setTotalPages(Math.ceil(allLogs.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = logs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className={style.container}>
        <h1>Analytics</h1>
        <div className={style.linksContainer}>
          <table className={style.tableContainer}>
            <thead className={style.tableHeader}>
              <tr>
                <th>Date & Time</th>
  
                <th>Original Link</th>
                <th>Short Link</th>
                <th>IP Address</th>
                <th>User Device</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <tr key={index} className={style.tableRow}>
                    <td>
                      {formatDateTime(log.date, log.clickedAt)}
                    </td>
                
                    <td>
                      <div className={style.original}>{log.originalUrl}</div>
                    </td>
                    <td>
                      <div className={style.short}>{log.shortUrl}</div>
                    </td>
                    <td className={style.remarks}>
                      {log.ipAddress}
                    </td>
                    <td className={style.remarks}>
                      {log.deviceType}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No logs found for this page.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
};

export default Analytics;