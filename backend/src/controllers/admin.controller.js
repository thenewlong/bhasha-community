const db = require('../config/db');

// Admin panel view: Clustered tables (Most used, Average used, Rare used)
exports.getClusteredContributions = async (req, res) => {
  try {
    const mostUsed = await db.query("SELECT * FROM contributions WHERE status = 'approved' AND clustering = 'Most used'");
    const averageUsed = await db.query("SELECT * FROM contributions WHERE status = 'approved' AND clustering = 'Average used'");
    const rareUsed = await db.query("SELECT * FROM contributions WHERE status = 'approved' AND clustering = 'Rare used'");

    res.status(200).json({
      success: true,
      clusters: {
        mostUsed: mostUsed.rows,
        averageUsed: averageUsed.rows,
        rareUsed: rareUsed.rows
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cluster data' });
  }
};

// Admin Full Access: Delete Word
exports.deleteContribution = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM contributions WHERE id = $1', [id]);
    res.status(200).json({ success: true, message: 'Contribution deleted by Admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting contribution' });
  }
};