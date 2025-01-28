import React, { useEffect, useState } from "react";
import style from "./Links.module.css";
import axios from "axios";

const Links = () => {
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
      <h1>links</h1>
      <div className={style.linksContainer}>
        <table>
          <tr>
            <th>Date</th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>Remarks</th>
            <th>Clicks</th>
            <th>status</th>
            <th>Action</th>
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
              <td>{item.remarks}</td>
              <td>{item.totalClicks}</td>
              <td>{item.status}</td>
              <td>edit delete</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Links;
