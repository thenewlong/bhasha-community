export const submitContribution = async (data) => {
  try {
    const response = await fetch('/api/contributions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Pehle raw text read karenge
    const rawText = await response.text();
    let result;

    try {
      result = JSON.parse(rawText);
    } catch (parseError) {
      // Agar backend HTML error page bhej raha hai
      throw new Error(`Server Crash Error (${response.status}): Server returned non-JSON response.`);
    }

    if (!response.ok) {
      throw new Error(result.message || 'Word submit karne me dikkat aayi');
    }

    return result;
  } catch (error) {
    console.error('API Error (submitContribution):', error.message);
    throw error;
  }
};