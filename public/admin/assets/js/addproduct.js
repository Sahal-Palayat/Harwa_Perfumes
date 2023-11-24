
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
    
    if (isNaN(quantity.value.trim()) || quantity.value.trim() === '' || parseInt(quantity.value.trim()) < 0) {
      if (isNaN(quantity.value.trim())) {
          quantityError.innerHTML = 'Must be a Number';
      } else if (quantity.value.trim() === '') {
          quantityError.innerHTML = 'Field is required';
      } else {
          quantityError.innerHTML = 'Quantity must be a non-negative number';
      }
  
      quantityError.style.color = 'red';
      setTimeout(() => {
          quantityError.innerHTML = '';
      }, 5000);
  
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
   
     if (isNaN(price.value.trim()) || price.value.trim() === '' || parseFloat(price.value.trim()) < 0) {
      if (isNaN(price.value.trim())) {
          priceError.innerHTML = 'Must be a Number';
      } else if (price.value.trim() === '') {
          priceError.innerHTML = 'Field is required';
      } else {
          priceError.innerHTML = 'Price must be a non-negative number';
      }
  
      priceError.style.color = 'red';
      setTimeout(() => {
          priceError.innerHTML = '';
      }, 5000);
  
      return false;
  }
  
      
   
 }
 