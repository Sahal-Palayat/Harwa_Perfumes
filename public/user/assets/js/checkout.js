let addressId = '';
let payment = '';

function selectAddress(id) {
  addressId = id;
}



const grandTotal = document.getElementById( 'grandTotal').value



function selectPaymentMethod(paymentmethod) {
  payment = paymentmethod;
}

function confirmorder() {
  try {
    Swal.fire({ 
      title: 'Confirm your order?',
      text: "You can cancel later !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Place Order!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch('/placeOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ addressId, payment, grandTotal }),
        });


        if (response.status === 201) {
          response.json().then((res) => {
            if (res.order) {

              var options = {
                key: 'rzp_test_1tAVpk23yo2fMa',
                amount: res.order.amount,
                currency: res.order.currency,
                name: 'Harwa Perfumes',
                description: ' Nice descripton',
                order_id: res.order.id,
                handler: async function (razorpayResponse) {
                  await fetch('/updatePayment', {
                    method: 'post',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ payment_details: razorpayResponse, addressId, payment, total: res.order.amount, grandTotal 
                    })

                  }).then(() => {
                    window.location.href = '/fullOrder';
                  })

                }
              }

              var rzp = new Razorpay(options);
              rzp.open();
            }
          })

        } else if (response.status === 501) {
          await Swal.fire(
            'Couldnt place order!',
            'Insufficient Balance.',
            'warning'
          )

        } else if (response.status === 200) {
          await Swal.fire(
            'Order Confirmed!',
            'Your order has been placed.',
            'success'
          ).then(() => {
            window.location.href = '/fullOrder';
          })


        }
        else {
          console.error('Failed to complete the order. Status code:', response.status);
        }
      }
      else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')

      }
    })






  } catch (error) {
    console.error('An error occurred:', error);
  }


}



function addWallet() {
  Swal.fire({
    title: "Enter amount to add to Wallet",
    input: "text",
    inputAttributes: {
      autocapitalize: "off"
    },
    showCancelButton: true,
    confirmButtonText: "Add",
    showLoaderOnConfirm: true,
    preConfirm: async (amount) => {
      try {
        const response = await fetch('/addWallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount })
        })
        if (response.status === 200) {
          response.json().then((res) => {
            if (res.order) {

              var options = {
                key: 'rzp_test_1tAVpk23yo2fMa',
                amount: res.order.amount,
                currency: res.order.currency,
                name: 'Harwa Perfumes',
                description: 'Have A good Day ',
                order_id: res.order.id,
                handler: async function (razorpayResponse) {
                  const response = await fetch('/updatewallet', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount: res.order.amount })
                  })
                  if (response.ok) {
                    Swal.fire({
                      position: "top",
                      icon: "success",
                      title: "Wallet Updated",
                      showConfirmButton: false,
                      timer: 1500
                    });
                  }
                },
              };
              var rzp = new Razorpay(options);
              rzp.open();
            }
          })
        }
        else {
          Swal.fire({
            position: "top",
            icon: 'warning',
            title: "Failed to update Wallet !",
            showConfirmButton: false,
            timer: 1500

          })
        }

      }
      catch (error) {
        console.log('An error occured:', error);
      }
    },
  });

}




function applyCoupon() {
  console.log('entered to apply coupon in script');
  
  Swal.fire({
    text: 'Apply your coupon code here !!!',
    input: 'text',  // 'input' instead of 'content'
    showCancelButton: true,
    confirmButtonText: 'Apply!',
    cancelButtonText: 'Cancel',
    allowOutsideClick: false,
  })
  .then((result) => {
    if (result.isConfirmed) {
      const couponCode = result.value;
      if (!couponCode) {
        throw null; // No coupon code provided, so exit without making an AJAX request
      }

      // Perform an AJAX request here with the couponCode
      fetch('/validationCoupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode }), // Send the couponCode in the request body
      })
      .then(response => response.json())
      .then(data => {
        if (data.isValid) {
         alert(data.coupon.offerPrice)
          const displayedSum = document.getElementById('grandTotal').value;
          console.log(displayedSum,'displayedSum');
          const numericValue = parseFloat(displayedSum.replace(/[^\d.]/g, ''));
          console.log(numericValue,'numericValue');
          const couponOfferPrice = parseFloat(data.coupon.offerPrice);
          console.log(couponOfferPrice,'couponOfferPrice');
          const newSum = numericValue - couponOfferPrice;
            
          console.log(newSum,'newSum, numericValue - couponOfferPrice');
          // Update the displayedSum value on the webpage
          const displayedSumElement = document.getElementById('Billtotal'); // Get the DOM element
          console.log(displayedSumElement.value);
          displayedSumElement.innerText = '₹' + newSum.toFixed(2); // Update the value property

          console.log(displayedSumElement.value);
          Swal.fire('Coupon Valid!', `Coupon code '${couponCode}' is valid.`);
        } else {
          Swal.fire('Invalid Coupon', `Coupon code '${couponCode}' is not valid.`);
        }
      })        
      .catch(error => {
        console.error('Error occurred during AJAX request:', error);
        Swal.fire('Error', 'An error occurred while processing your request.', 'error');
      });
    }
  })
  .catch((error) => {
    if (error) {
      Swal.fire('Oh noes!', 'An error occurred!', 'error');
    } else {
      Swal.close();
    }
  });
  }




 document.addEventListener("DOMContentLoaded", function () {
  const copyButtons = document.querySelectorAll(".btn-copy");
  copyButtons.forEach(copyButton => {
      copyButton.addEventListener("click", function () {
          const couponName = this.getAttribute("data-coupon-name");
          copyToClipboard(couponName);
          updateCopyButton(this); // Update the clicked copy button's appearance
      });
  });
});

function updateCopyButton(button) {
  button.textContent = 'Copied';
  button.disabled = true; 
}

async function copyToClipboard(text) {
  try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard:', text);
  } catch (error) {
      console.error("Failed to copy:", error);
  }
}

