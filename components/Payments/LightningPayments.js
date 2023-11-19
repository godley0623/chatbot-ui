let errorBody;

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
    errorBody = {
      icon: "error",
      title: "Payment Error",
      text: "User denied permission or canceled",
      imageHeight: 150,
      imageAlt: "Getalby Logo",
      confirmButtonColor: "#202123"
    }
    return { payment: false, error: errorBody };
  }

  if (!window.webln) {
    errorBody = {
      title: "Payment Error",
      text: "Please use a modern browser with the getalby.com extension installed.",
      imageUrl: "https://d4.alternativeto.net/wbw0Br9Q0qwY4-kY0h2eR0uVx6i-jBza8accEf1Up1A/rs:fill:280:280:0/g:ce:0:0/YWJzOi8vZGlzdC9pY29ucy9hbGJ5XzIxMzMyNS5wbmc.png",
      imageHeight: 150,
      imageAlt: "Getalby Logo",
      confirmButtonColor: "#202123"
    }
    return { payment: false, error: errorBody };
  } else {
    localStorage.setItem("pay-progress", "true")
    console.log("Payment is being processed.")
    await webln.enable();
    let result;

    try {
      result = await webln.keysend({
        destination: "03dd1b795652debf811f93142ea4e7015889929e43220966e2431b38f74535dd23",
        amount: "13",
        customRecords: {
          "696969": "RobotKnows"
        }


      });
    } catch (error) {
      errorBody = {
        icon: "error",
        title: "Payment Error",
        text: `${error}`,
        imageHeight: 150,
        imageAlt: "Getalby Logo",
        confirmButtonColor: "#202123"
      }
      return { payment: false, error: errorBody }
    }

    console.log("Payment Complete.")
    console.log(result)
    return { payment: true, error: errorBody };
  }
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
