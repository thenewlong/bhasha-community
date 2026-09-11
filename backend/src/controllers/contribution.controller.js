const db = require('../config/db');

// Student contribution submit karega
exports.submitContribution = async (req, res) => {
  const { kokborok_word, english_word, hindi_word, bangali_word, clustering, contributor_name, submitted_by_email } = req.body;

  try {
    // 1. Duplicate Word Check Logic
    const duplicateCheck = await db.query(
      'SELECT id FROM contributions WHERE LOWER(kokborok_word) = LOWER($1)',
      [kokborok_word.trim()]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ye Kokborok word pehle se database me submitted hai! Duplicate entry not allowed.' 
      });
    }

    // 2. Insert into DB with status = 'pending'
    const newContribution = await db.query(
      `INSERT INTO contributions 
      (kokborok_word, english_word, hindi_word, bangali_word, clustering, contributor_name, submitted_by_email, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') 
      RETURNING *`,
      [kokborok_word.trim(), english_word, hindi_word, bangali_word, clustering, contributor_name, submitted_by_email]
    );

    res.status(201).json({
      success: true,
      message: 'Word successfully submitted for Moderator review!',
      data: newContribution.rows[0]
    });

  } catch (error) {
    console.error('Error submitting contribution:', error);
    res.status(500).json({ success: false, message: 'Server error during submission' });
  }
};