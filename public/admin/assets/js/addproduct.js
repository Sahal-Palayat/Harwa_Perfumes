
function validate() {

    // Input feilds
    const name = document.getElementById('name')
    const price = document.getElementById('price')
    const description = document.getElementById('description')
    const quantity = document.getElementById('quantity')
 
    // Error feilds
    const nameError = document.getElementById('nameError')
    const priceError = document.getElementById('priceError')
    const descriptionError = document.getElementById('descriptionError');
    const quantityError = document.getElementById('quantityError');
  
 
    //name feild
    if (name.value.trim() === '') {
       nameError.innerHTML = 'Field is required'
       nameError.style.color='red'
       setTimeout(() => {
          nameError.innerHTML = ''
       }, 5000)
       return false;
    }
    
    if (isNaN(quantity.value.trim()) || quantity.value.trim() === '') {
        if(isNaN(quantity.value.trim())){
            quantityError.innerHTML = 'Must a Number'
            quantityError.style.color = 'red'
            setTimeout(() => {
                quantityError.innerHTML = ''
              }, 5000)
        }else if(quantity.value.trim() === ''){
            quantityError.innerHTML = 'Field is required'
            quantityError.style.color = 'red'
            setTimeout(() => {
                quantityError.innerHTML = ''
              }, 5000)
        }
        
        return false;
      }
 
     if (description.value.trim() === '') {
        descriptionError.innerHTML = 'Field is required'
        descriptionError.style.color='red'
        setTimeout(() => {
           descriptionError.innerHTML = ''
        }, 5000)
        return false;
     }
   
     if (isNaN(price.value.trim()) || price.value.trim() === '') {
        if(isNaN(price.value.trim())){
            priceError.innerHTML = 'Must a Number'
            priceError.style.color = 'red'
            setTimeout(() => {
                priceError.innerHTML = ''
              }, 5000)
        }else if(price.value.trim() === ''){
            priceError.innerHTML = 'Field is required'
            priceError.style.color = 'red'
            setTimeout(() => {
                priceError.innerHTML = ''
              }, 5000)
        }
        
        return false;
      }
      
   
 }
 