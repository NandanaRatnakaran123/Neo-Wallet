// login page
// 1. function to login
function login() {
   let namegiven = document.getElementById('uname').value;
   let pssdgiven = document.getElementById('upassword').value;

   if (namegiven === '' || pssdgiven === '') {
      alert('Please enter details');
      
   }

   let key = namegiven;
   let details = JSON.parse(localStorage.getItem(key));

   if (!details) { // If no user data is found in localStorage
      alert("User not found. Please check your username.");
      
   }

 
   let nameOriginal = details.Name;
   let pssdOriginal = details.password;

   if (nameOriginal === namegiven && pssdOriginal === pssdgiven) {
      alert('Login successful');
      window.location='/main.html '
   } 
   else {
      alert('Incorrect username or password');
   }
  }
   

// Register page
// 1. function to register


function registerData(){
   details={
    Name:uname.value,
    password:upssd.value ,
    Email:uemail.value,
   }
   console.log(details);


   if(localStorage.getItem(details.Name)){
        alert('User already exits!!')
   }
   else{
    localStorage.setItem(details.Name,JSON.stringify(details))
      // to store  add user seperatelly
      localStorage.setItem("loggedInAccount",details.Name)
    alert('User added successfully :)')
   
    

    window.location="./index.html"
   
     

   }
   
}