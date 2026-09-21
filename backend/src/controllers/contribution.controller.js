const db = require('../config/db');

// Student contribution submit karega
exports.submitContribution = async (req, res) => {
  const { 
    kokborok_word, 
    english_word, 
    hindi_word, 
    bangali_word, 
    clustering, 
    contributor_name, 
    submitted_by_email 
  } = req.body;

  // 1. Basic Validation (Crash se bachne ke liye)
  if (!kokborok_word || typeof kokborok_word !== 'string' || !kokborok_word.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Kokborok word is required!'
    });
  }

  const cleanKokborok = kokborok_word.trim();

  try {
    // 2. Duplicate Word Check Logic
    const duplicateCheck = await db.query(
      'SELECT id FROM contributions WHERE LOWER(kokborok_word) = LOWER($1)',
      [cleanKokborok]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'this word is already submitted.' 
      });
    }

    // 3. Insert into DB with status = 'pending' (Fallback values ke saath)
    const newContribution = await db.query(
      `INSERT INTO contributions 
      (kokborok_word, english_word, hindi_word, bangali_word, clustering, contributor_name, submitted_by_email, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') 
      RETURNING *`,
      [
        cleanKokborok,
        english_word ? english_word.trim() : '',
        hindi_word ? hindi_word.trim() : '',
        bangali_word ? bangali_word.trim() : '',
        clustering || '',
        contributor_name || 'Anonymous',
        submitted_by_email || ''
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Word successfully submitted for Moderator review!',
      data: newContribution.rows[0]
    });

  } catch (error) {
    console.error('❌ Error submitting contribution:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during submission: ' + error.message 
    });
  }
};