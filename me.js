module.exports = async (req, res) => {
  try {
    const authToken = req.headers.authorization || req.query.token || null;
    let user = null;

    if (authToken === "admin-token") {
      user = { id: "kejicjs11", role: "admin", name: "Keji Shaka", email: "kejicjs11@gmail.com" };
    } else if (authToken === "owner-token") {
      user = { id: "kejicjs11", role: "owner", name: "Keji Shaka", email: "kejicjs11@gmail.com" };
    } else {
      user = { id: "guest001", role: "guest", name: "Guest User", email: "guest@example.com" };
    }

    return res.status(200).json(user);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
