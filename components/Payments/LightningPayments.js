export const ProcessPayment = async () => {
  //await makeKeysendPayment();
 const payment = await requestPayment();
 return payment;
};


const requestPayment = async () => {
  try {
    if (typeof window.webln !== 'undefined') {
      await window.webln.enable();
      console.log("enabled");
    }
  } catch (error) {
    //User denied permission or canceled
    console.log(error);
  }

  if (!window.webln) {
    return false;
  }


  await webln.enable();
  const result = await webln.keysend({
    destination: "03dd1b795652debf811f93142ea4e7015889929e43220966e2431b38f74535dd23",
    amount: "13",
    customRecords: {
      "696969": "RobotKnows"
    }

  });
  console.log(result)
};












const makeKeysendPayment = async () => {
  try {
    console.log("hello3");
    const response = await fetch("https://api.getalby.com/payments/keysend", {
      method: "POST",
      headers: {
        Authorization: "Bearer MMNMODJIYZYTZJE2NI0ZZJAZLTGYNZITN2UZODQ0ZDBHZJE5",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 10,
        destination:
          "03dd1b795652debf811f93142ea4e7015889929e43220966e2431b38f74535dd23",
        customRecords: {
          696969: "C7YnGcZjxCd4Q1kwoWhn",
        },
      }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    // It's good practice to handle errors in async functions
    console.error("Error fetching invoice:", error);
    throw error; // Re-throw the error if you want to allow the caller to handle it
  }
};
