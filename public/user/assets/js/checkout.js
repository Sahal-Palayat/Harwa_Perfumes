let addressId='';
let payment='';

function selectAddress(id)
{
    alert('call 1')
   addressId=id;
}

function selectPaymentMethod(paymethod)
{
    payment=paymethod;
}

 function confirmorder()
{
  alert('2')
  alert(addressId)
  alert(payment)
   try{

  Swal.fire({
    title: 'Confirm your order?',
    text: "You can cancel later !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Place Order!'
  }).then( async (result) => {
    if (result.isConfirmed) {
        const response = await fetch('/shipping', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ addressId,payment }),
        });
        if (response.ok) {
      await Swal.fire(
        'Order Confirmed!',
        'Your order has been placed.',
        'success'
      )
      
    }
    else {
        console.error('Failed to complete the order. Status code:', response.status);
        }
    }
    else if(result.isDenied)
    {
        Swal.fire('Changes are not saved', '', 'info')

    }
  })
} catch (error) {
    console.error('An error occurred:', error);
}


}