// Example client-side call to the API route
async function maxInput(body) {
    try {
      const response = await fetch('/api/countTokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body) ,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Token Count from API:', data.totalTokenCount);






      return data.totalTokenCount;
    } catch (error) {
      console.error('Error fetching token count:', error);
    }
  }

  export default maxInput;
