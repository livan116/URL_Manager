import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';

const Analytics = () => {
  const [links, setLinks] = useState([]);
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
    <div>
      <table>
          <tr>
            <th>Date</th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>ip address</th>
            <th>User Device</th>
          </tr>

          {links.map((item, index) => (
            <tr key={index}>
              <td>
                {new Date(item.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </td>
              <td>{item.originalUrl}</td>
              <td>{item.shortUrl}</td>
              <td>{item.accessLogs.ipAddress}</td>
              <td>{item.accessLogs.deviceType}</td>
            </tr>
          ))}
        </table>
    </div>
  )
}

export default Analytics