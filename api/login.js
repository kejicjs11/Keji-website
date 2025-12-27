module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    // Users with real info
    const users = [
      { 
        id: "kejicjs11", 
        email: "kejicjs11@gmail.com", 
        password: "@keji4265", // choose a strong password
        role: "admin", 
        name: "Keji Shaka" 
      },
      { 
        id: "kejicjs11", 
        email: "kejicjs11@gmail.com", 
        password: "@Keji4265", // another password for owner
        role: "owner", 
        name: "Keji Shaka" 
      },
      { 
        id: "guest001", 
        email: "guest@example.com", 
        password: "guest123", 
        role: "guest", 
        name: "Guest User" 
      }
    ];

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = user.role + "-token"; // temporary token for serverless auth

    return res.status(200).json({ token, role: user.role, name: user.name, id: user.id, email: user.email });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
