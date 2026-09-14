const db = require('../config/db');

// 1. Get All Contributions (Includes pending, approved, and rejected words)
exports.getAllContributions = async (req, res) => {
  try {
    // ⚠️ REMOVED "WHERE status = 'approved'" so admin can see ALL submitted words
    const result = await db.query(
      `SELECT 
        id, 
        kokborok_word, 
        english_word, 
        hindi_word, 
        COALESCE(bangali_word, bengali_word) AS bangali_word, 
        clustering, 
        contributor_name, 
        submitted_by_email, 
        COALESCE(status, 'pending') AS status, 
        created_at 
       FROM contributions 
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching admin contributions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching contributions', 
      error: error.message 
    });
  }
};

// 2. Get Clustered Contributions (Supports both array and clustered object formats)
exports.getClusteredContributions = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT *, COALESCE(status, 'pending') AS status FROM contributions ORDER BY created_at DESC`
    );
    const rows = result.rows;

    const mostUsed = rows.filter(r => (r.clustering || '').toLowerCase() === 'most used');
    const averageUsed = rows.filter(r => (r.clustering || '').toLowerCase() === 'average used');
    const rareUsed = rows.filter(r => (r.clustering || '').toLowerCase() === 'rare used');

    res.status(200).json({
      success: true,
      data: rows, // Direct array for simple frontend rendering
      clusters: {
        mostUsed,
        averageUsed,
        rareUsed
      }
    });
  } catch (error) {
    console.error('Error fetching cluster data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching cluster data', 
      error: error.message 
    });
  }
};

// 3. Update Contribution Status (Approve / Reject)
exports.updateContributionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  try {
    const result = await db.query(
      'UPDATE contributions SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Contribution record not found' });
    }

    res.status(200).json({
      success: true,
      message: `Contribution status updated to ${status}`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating status', 
      error: error.message 
    });
  }
};

// 4. Admin Full Access: Delete Word
exports.deleteContribution = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM contributions WHERE id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Contribution record not found' });
    }

    res.status(200).json({ success: true, message: 'Contribution deleted by Admin' });
  } catch (error) {
    console.error('Error deleting contribution:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting contribution', 
      error: error.message 
    });
  }
};