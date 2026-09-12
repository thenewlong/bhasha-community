// Base URL: Vercel par '/api' relative path automatic live URL utha leta hai
const BASE_URL = '/api';

// 1. Submit Word Contribution
export const submitContribution = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/contributions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Word submit karne mein dikkat aayi');
    }

    return result;
  } catch (error) {
    console.error('API Error (submitContribution):', error.message);
    throw error;
  }
};

// 2. Fetch Contributions / Words
export const getContributions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/contributions`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Words load nahi ho paaye');
    }

    return result;
  } catch (error) {
    console.error('API Error (getContributions):', error.message);
    throw error;
  }
};