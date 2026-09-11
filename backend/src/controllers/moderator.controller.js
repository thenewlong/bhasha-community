const db = require('../config/db');

// Get all pending contributions for Moderator
exports.getPendingContributions = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM contributions WHERE status = 'pending' ORDER BY created_at DESC"
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching pending words' });
  }
};

// Moderator Edit & Approve/Reject Karega
exports.reviewContribution = async (req, res) => {
  const { id } = req.params;
  const { kokborok_word, english_word, hindi_word, bangali_word, clustering, status } = req.body;

  try {
    const result = await db.query(
      `UPDATE contributions 
       SET kokborok_word = $1, english_word = $2, hindi_word = $3, bangali_word = $4, 
           clustering = $5, status = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [kokborok_word, english_word, hindi_word, bangali_word, clustering, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Contribution not found' });
    }

    res.status(200).json({
      success: true,
      message: `Word status updated to ${status}`,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating contribution' });
  }
};