import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./Analytics.module.css";
import Pagination from "../Pagination/Pagination";

const Analytics = () => {
  const [logs, setLogs] = useState([]); // Store all the logs
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total number of pages for pagination
  const itemsPerPage = 10; // Show 10 logs per page

  // Fetch data on page load and whenever currentPage changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [currentPage]);

  // Function to fetch URLs and their access logs
  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/url?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Extract URLs and logs, flatten logs across all URLs
      const urls = response.data.data;
      const allLogs = [];

      // Flatten the logs so we can paginate on the logs themselves
      urls.forEach((urlItem) => {
        urlItem.accessLogs.forEach((log) => {
          allLogs.push({
            originalUrl: urlItem.originalUrl,
            shortUrl: urlItem.shortUrl,
            createdAt: urlItem.createdAt,
            ipAddress: log.ipAddress,
            deviceType: log.deviceType,
          });
        });
      });

      // Set logs and pagination details
      setLogs(allLogs);
      setTotalPages(Math.ceil(allLogs.length / itemsPerPage)); // Set total pages based on flattened logs
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  // Calculate the logs to display for the current page
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
                <th>Timestamp</th>
                <th>Original Link</th>
                <th>Short Link</th>
                <th>IP Address</th>
                <th>User Device</th>
              </tr>
            </thead>
            <tbody>
              {/* Map over the current logs for the current page */}
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <tr key={index} className={style.tableRow}>
                    <td>
                      {/* Timestamp */}
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td>
                      {/* Original Link */}
                      <div className={style.original}>{log.originalUrl}</div>
                    </td>
                    <td>
                      {/* Short Link */}
                      <div className={style.short}>{log.shortUrl}</div>
                    </td>
                    <td className={style.remarks}>
                      {/* IP Address */}
                      {log.ipAddress || "N/A"}
                    </td>
                    <td className={style.remarks}>
                      {/* Device Type */}
                      {log.deviceType || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No logs found for this page.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)} // Update current page
        />
      </div>
    </>
  );
};

export default Analytics;
