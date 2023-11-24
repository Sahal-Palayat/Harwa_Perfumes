let addressId='';
let payment='';

function selectAddress(id)
{

   addressId=id;
  
}
 const grandTotal=document.getElementById('grandTotal').value

function selectPaymentMethod(paymentmethod)
{
    
    payment=paymentmethod;
}

 function confirmorder()
{
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
        const response = await fetch('/placeOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ addressId,payment,grandTotal }),
        });


        if (response.status===201) {
            response.json().then((res)=>{
                if(res.order){
                   alert('res')
                    var options={
                        key:'rzp_test_1tAVpk23yo2fMa',
                        amount:res.order.amount,
                        currency:res.order.currency,
                        name: 'Harwa Perfumes',
                        description: ' Nice descripton',
                        order_id: res.order.id,	
                        handler:async function(razorpayResponse){
                            await fetch('/updatePayment',{
                                method:'post',
                                headers:{
                                  'Content-Type':'application/json'
                                },
                                body:JSON.stringify({payment_details:razorpayResponse,addressId,payment,total:res.order.amount,grandTotal})
                              
                               })
                        }
                    }
                    
                    var rzp=new Razorpay(options);
                    rzp.open();
                }
            })
      
        }else if(response.status === 501){
            await Swal.fire(
                'Couldnt place order!',
                'Insufficient Balance.',
                'warning'
              )
              
        }else if(response.status===200){
            await Swal.fire(
                'Order Confirmed!',
                'Your order has been placed.',
                'success'
              )
           

        }
        else  {
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



function addWallet()
{
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
     try
     {
      const response= await fetch('/addWallet',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({amount})
      })
      if(response.status===200)
      {
       response.json().then((res)=>{
        if(res.order)
        {
           
          var options={
            key:'rzp_test_1tAVpk23yo2fMa',
            amount:res.order.amount,
            currency:res.order.currency,
            name:'Harwa Perfumes',
            description:'Have A good Day ',
            order_id:res.order.id,
            handler:async function(razorpayResponse)
            {
             const response=await fetch('/updatewallet',{
                method:'POST',
                headers:{
                  'Content-Type':'application/json'
                },
                body:JSON.stringify({amount:res.order.amount})
              })
              if(response.ok)
              {
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
          var rzp=new Razorpay(options);
          rzp.open();
        }
       })
      }
        else{
          Swal.fire({
            position:"top",
            icon:'warning',
            title:"Failed to update Wallet !",
            showConfirmButton:false,
            timer:1500
  
          })
        }
      
     }
     catch(error)
     {
     console.log('An error occured:',error);
     }
    },
  });
  
}