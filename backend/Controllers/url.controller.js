const Url = require("../Models/url.schema");
const shortid = require("shortid");
const moment = require('moment');  // To manage dates
const urlSchema = require("../Models/url.schema");


exports.shortenUrl = async (req, res) => {
  const { originalUrl, expirationDate, remarks } = req.body;
  const userId = req.user.id;  // Extract userId from token
  
  // Dynamically get the base URL (works for both development and production)
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  // Generate URL code (use shortid, nanoid, or any unique ID generator)
  const urlCode = shortid.generate();

  try {
    // Check if the original URL already exists in the database
    let url = await Url.findOne({ originalUrl });

    if (url) {
      // If the URL exists, return the existing shortened URL
      return res.json(url);
    } else {
      // Create a new shortened URL
      const shortUrl = `${baseUrl}/${urlCode}`;

      // Handle expiration date if provided
      let expiration = null;
      if (expirationDate) {
        expiration = new Date(expirationDate);
      }

      // Save the new URL to the database
      url = new Url({
        originalUrl,
        shortUrl,
        urlCode,
        userId:userId,
        expirationDate: expiration,
        remarks,
        status: "Active",
      });
      console.log("remarks",remarks)
      await url.save();
      console.log("url:",url)
      return res.json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

// In routes/url.js or similar file

// get info from the db

exports.getInfo = async(req,res) => {
  const userId = req.user.id; 

  try {
    // Fetch all URLs created by the authenticated user
    const urls = await Url.find({ userId: req.user._id });

    if (!urls.length) {
      return res.status(404).json({ message: "No links found for this user" });
    }

    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving URLs", error });
  }
}

// Route to redirect short URL to the original URL
exports.redirectUrl = async (req, res) => {
  const shortUrlCode = req.params.shortUrl;

  try {
    // Look up the original URL using the short URL code
    const urlData = await Url.findOne({ urlCode: shortUrlCode });

    if (!urlData) {
      return res.status(404).json("No URL found");
    }

    urlData.totalClicks += 1

     // Get today's date in 'YYYY-MM-DD' format
     const today = moment().format('YYYY-MM-DD');

     // Check if there's already a record for today's date in clicksPerDay
     const existingDayRecord = urlData.clicksPerDay.find(day => day.date === today);
 
     if (existingDayRecord) {
       // Increment the count for today's date
       existingDayRecord.count += 1;
     } else {
       // Add a new record for today
       urlData.clicksPerDay.push({ date: today, count: 1 });
     }

    // Extract device type and IP address
    const deviceType = req.device.type || "Desktop"; // Use express-device to get device type
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // Get IP address

    // Save the device details and IP address to the database

    urlData.accessLogs.push({
      deviceType,
      ipAddress,
      clickedAt: new Date(), // Store the current timestamp
    });

    await urlData.save();

    // If found, redirect the user to the original URL
    return res.redirect(urlData.originalUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error");
  }
};

exports.updateUrl = async (req, res) => {
  const { id } = req.params;
  const { originalUrl, expirationDate, remarks, status } = req.body;

  try {
    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Check if the logged-in user is the owner of the URL
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this link" });
    }

    url.originalUrl = originalUrl;
    url.expirationDate = expirationDate;
    url.remarks = remarks;
    url.status = status;

    await url.save();
    res.json(url);
  }
     catch (error) {
    res.status(500).json({ message: "Error updating the link", error });
  }
}

// deleting the URL

exports.deleteUrl = async (req, res) => {
  const { id } = req.params;

  try {
    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Check if the logged-in user is the owner of the URL
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this link" });
    }

    await url.delete();
    res.json({ message: "Link deleted successfully" });
  }  catch (error) {
    res.status(500).json({ message: "Error deleting the link", error });
  }
}