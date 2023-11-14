 
 function validate(){
 // Input feilds
 const name = document.getElementById('name')
 const email = document.getElementById('email')
 const password = document.getElementById('password')
 const mobile = document.getElementById('mobile')
 const confirmPassword=document.getElementById('confirmPassword')
 // Error feilds
 const nameError = document.getElementById('nameError')
 const emailError = document.getElementById('emailError')
 const passwordError = document.getElementById('passwordError')
 const mobileError = document.getElementById('mobileError');
 const confirmPasswordError=document.getElementById('confirmPasswordError')
 // Regex   
 const nameRegex = /^[A-Z]/;
 const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail+\.[a-zA-Z]{3}$/;
 const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
 const mobileRegex = /^[0-9]{10}$/;
 

 //----name field
if(name.value.trim()===''){
    nameError.innerHTML='Field is Required'
    nameError.style.color='red'
    setTimeout(()=>{
        nameError.innerHTML=''
    },5000)
    return false
}
if(!nameRegex.test(name.value)){
    nameError.innerHTML='First letter should be capital'
    nameError.style.color='red'
    setTimeout(()=>{
        nameError.innerHTML=''
    },5000)
    return false
}

//------email field
if(email.value.trim()===''){
    emailError.innerHTML='Field is required'
    emailError.style.color='red'
    setTimeout(() => {
        emailError.innerHTML=''
    }, 5000);
    return false
}
if(!emailRegex.test(email.value)){
    emailError.innerHTML='Please enter valid email'
    emailError.style.color='red'
    setTimeout(() => {
        emailError.innerHTML=''
    }, 5000);
    return false
}
 // password feild
 if (password.value.trim() === '') {
    passwordError.innerHTML = 'Field is required'
    passwordError.style.color='red'
    setTimeout(() => {
       passwordError.innerHTML = ''
    }, 5000)
    return false;
 }
 if (!passwordRegex.test(password.value)) {
    passwordError.innerHTML = "Please enter a tight password"
    passwordError.style.color='red'
    setTimeout(() => {
       passwordError.innerHTML = ''
    }, 5000);
    return false;
 }

if(password.value !==confirmPassword.value){
    confirmPasswordError.innerHTML='Do not Match Password'
    confirmPasswordError.style.color='red'
    setTimeout(()=>{
        confirmPasswordError.innerHTML=''
    },5000);
    return false
}


  //mobile feild
  if (mobile.value.trim() === '') {
    mobileError.innerHTML = 'Field is required'
    mobileError.style.color='red'
    setTimeout(() => {
       mobileError.innerHTML = ''
    }, 5000)
    return false;
 }

 if(!mobileRegex.test(mobile.value)){
    mobileError.innerHTML = 'Please enter a valid number'
    mobileError.style.color='red'
    setTimeout(()=>{
       mobileError.innerHTML = ''
    },5000)
    return false;
 }
return true;
}
