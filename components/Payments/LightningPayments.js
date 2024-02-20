

let errorBody;

export const ProcessPayment = async (invoice) => {
  const payment = await requestPayment(invoice);
  console.log(payment, 'payment')
  return payment;
};

const requestPayment = async (invoice) => {
  try {
    console.log('window.webln:', window.webln);
    if (typeof window.webln !== 'undefined') {
      await window.webln.enable();
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
    await webln.enable();
    let result;

    try {
      result = await window.webln.sendPayment(invoice);
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
    return { payment: true, error: errorBody };
  }
};