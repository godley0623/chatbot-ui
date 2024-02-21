const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCreditIdBalance = async (credit_id) => {
  const response = await fetch(`${API_URL}/accountData/${credit_id}`);
  if (response.ok) {
    const accountData = await response.json();
    return accountData;
  } else if (response.status === 404) {
    console.error('Error:', response.statusText);
    //Remove credit_id from localstorage
    localStorage.removeItem('credit_id');
    return { error: response.statusText }
  }
};