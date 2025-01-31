const Url = require("../Models/url.schema");
const shortid = require("shortid");
const moment = require("moment"); // To manage dates
const cron = require('node-cron');

exports.shortenUrl = async (req, res) => {
  const { originalUrl, expirationDate, remarks } = req.body;
  const userId = req.user.id;

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const urlCode = shortid.generate();

  try {
    // Check if the original URL already exists
    let url = await Url.findOne({ originalUrl, userId });

    if (url) {
      return res.json(url);
    } else {
      const shortUrl = `${baseUrl}/${urlCode}`;

      // Handle expiration date and status
      let status = "Active";
      let expiration = null;

      if (expirationDate) {
        expiration = new Date(expirationDate);
        // Check if the expiration date is in the past
        if (moment(expiration).isBefore(moment())) {
          status = "Inactive";
        }
      }

      // Create new URL
      url = new Url({
        originalUrl,
        shortUrl,
        urlCode,
        userId,
        expirationDate: expiration,
        remarks,
        status,
        totalClicks: 0,
        clicksPerDay: [],
        accessLogs: []
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
    const urlData = await Url.findOne({ urlCode: shortUrlCode });

    if (!urlData) {
      return res.status(404).json("No URL found");
    }

    // Check if URL has expired
    if (urlData.expirationDate && moment().isAfter(urlData.expirationDate)) {
      // Update status to Inactive if it hasn't been updated yet
      if (urlData.status !== "Inactive") {
        urlData.status = "Inactive";
        await urlData.save();
      }
      return res.status(410).json({ 
        message: "This link has expired", 
        expirationDate: urlData.expirationDate 
      });
    }

    // If URL is manually set to Inactive
    if (urlData.status === "Inactive") {
      return res.status(410).json({ 
        message: "This link is inactive"
      });
    }

    // Proceed with click tracking
    urlData.totalClicks += 1;

    const today = moment().format("YYYY-MM-DD");
    const existingDayRecord = urlData.clicksPerDay.find(
      (day) => day.date === today
    );

    if (existingDayRecord) {
      existingDayRecord.count += 1;
    } else {
      urlData.clicksPerDay.push({ date: today, count: 1 });
    }

    // Add access log
    const deviceType = req.device.type || "Desktop";
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    urlData.accessLogs.push({
      deviceType,
      ipAddress,
      clickedAt: new Date()
    });

    await urlData.save();

    return res.redirect(urlData.originalUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error");
  }
};

exports.updateUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { originalUrl, remarks, expirationDate } = req.body;
    console.log(expirationDate)

    // Determine status based on expiration date
    let status = "Active";
    if (expirationDate) {
      if (moment(expirationDate).isBefore(moment())) {
        status = "Inactive";
      }
    }

    const updatedLink = await Url.findByIdAndUpdate(
      id, 
      { 
        originalUrl, 
        remarks, 
        expirationDate,
        status,
        $set: { 
          lastUpdated: new Date()
        }
      },
      { new: true }
    );

    if (!updatedLink) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.status(200).json({ 
      message: "Link updated successfully", 
      data: updatedLink 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// deleting the URL

exports.deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
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


const updateExpiredUrls = async () => {
  try {
    const now = new Date();
    const result = await Url.updateMany(
      {
        expirationDate: { $lt: now },
        status: 'Active'
      },
      {
        $set: { status: 'Inactive' }
      }
    );
    console.log(`Updated ${result.modifiedCount} expired URLs`);
  } catch (error) {
    console.error('Error updating expired URLs:', error);
  }
};

// Run every minute
cron.schedule('* * * * *', updateExpiredUrls);