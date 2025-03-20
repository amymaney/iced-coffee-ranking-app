export async function authenticateUser(email: string, password: string) {
    const users = [
      { id: "1", email: "amymaneyshaw@hotmail.com", password: "password123" }, // Dummy user
    ];
  
    // Find user in fake database
    const user = users.find((u) => u.email === email && u.password === password);
  
    if (!user) return null;
  
    return { id: user.id, email: user.email };
  }
  