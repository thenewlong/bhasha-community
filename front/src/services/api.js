// Server.js ke end me:
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Ye line ADD karo (Vercel serverless ke liye compulsory hai):
module.exports = app;