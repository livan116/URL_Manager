const Url = require("../Models/url.schema");
const shortid = require("shortid");
const moment = require("moment"); // To manage dates
const urlSchema = require("../Models/url.schema");

exports.shortenUrl = async (req, res) => {
  const { originalUrl, expirationDate, remarks } = req.body;
  const userId = req.user.id; // Extract userId from token

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
        userId: userId,
        expirationDate: expiration,
        remarks,
        status: "Active",
      });

      await url.save();

      return res.json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

// In routes/url.js or similar file

// Get a single link by ID
exports.getLinkById = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Url.findById(id);

    if (!link) {
      return res.status(404).json({ success: false, error: "Link not found" });
    }

    res.status(200).json({ success: true, data: link });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Ensure this matches the frontend
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalItems = await Url.countDocuments({ userId: userId });
    const totalPages = Math.ceil(totalItems / limit);

    // Fetch paginated URLs
    const urls = await Url.find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!urls.length) {
      return res.status(404).json({ 
        message: "No links found for this user",
        data: [],
        currentPage: page,
        totalPages: 0,
        totalItems: 0
      });
    }

    res.json({
      data: urls,
      currentPage: page,
      totalPages,
      totalItems
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving URLs", error });
  }
};

// Route to redirect short URL to the original URL
exports.redirectUrl = async (req, res) => {
  const shortUrlCode = req.params.shortUrl;

  try {
    // Look up the original URL using the short URL code
    const urlData = await Url.findOne({ urlCode: shortUrlCode });

    if (!urlData) {
      return res.status(404).json("No URL found");
    }

    urlData.totalClicks += 1;

    // Get today's date in 'YYYY-MM-DD' format
    const today = moment().format("YYYY-MM-DD");

    // Check if there's already a record for today's date in clicksPerDay
    const existingDayRecord = urlData.clicksPerDay.find(
      (day) => day.date === today
    );

    if (existingDayRecord) {
      // Increment the count for today's date
      existingDayRecord.count += 1;
    } else {
      // Add a new record for today
      urlData.clicksPerDay.push({ date: today, count: 1 });
    }

    // Extract device type and IP address
    const deviceType = req.device.type || "Desktop"; // Use express-device to get device type
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get IP address

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
  try {
    const { id } = req.params;

    // Build an object containing only the fields the user wants to update
    const { originalUrl, remarks, expirationDate } = req.body;
    
    // Check expiry and set status
    const status = expirationDate && new Date(expirationDate) < new Date() ? 'Inactive' : 'Active';
    

    const updatedLink = await Url.findByIdAndUpdate(id, { 
      originalUrl, 
      remarks, 
      expirationDate,
      status 
    },
    { new: true });

    if (!updatedLink) {
      return res.status(404).json({ error: "Link not found" });
    }

    res
      .status(200)
      .json({ message: "Link updated successfully", data: updatedLink });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// deleting the URL

exports.deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLink = await Url.findByIdAndDelete(id);

    if (!deletedLink) {
      return res.status(404).json({ error: "Link not found" });
    }
    res
      .status(200)
      .json({ message: "Link deleted successfully", data: deletedLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
