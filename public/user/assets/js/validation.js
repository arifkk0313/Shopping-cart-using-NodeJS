      // signup validation

function validation() {
    var  CustomerFirstName = document.getElementById("CustomerFirstName").value;
    var emailAddress=document.getElementById("emailAddress").value;
    var phonenumber=document.getElementById("phonenumber").value;
    var password = document.getElementById("password").value;
    var  confirmPassword = document.getElementById("confirmPassword").value;


    if (CustomerFirstName == "") {
      document.getElementById("FirstName").innerHTML =
        " ** Please fill the username field";
      return false;
    }
    else{
      document.getElementById("FirstName").innerHTML =""
    }

    if (CustomerFirstName.length <= 2 || CustomerFirstName.length > 20) {
      document.getElementById("FirstName").innerHTML =
        " ** Username lenght must be between 2 and 10";
      return false;
    }
    else{
      document.getElementById("FirstName").innerHTML =""
    }

    if (!isNaN(CustomerFirstName)) {
      document.getElementById("FirstName").innerHTML =
        " ** only characters are allowed";
      return false;
    }
    else{
      document.getElementById("FirstName").innerHTML =""
    }



      if(emailAddress==""){
        document.getElementById("EmailAddress").innerHTML =
        " ** Please fill the Email ";
      return false;
      }
      else{
        document.getElementById("EmailAddress").innerHTML =""
      }




      if (emailAddress.indexOf("@") <= 0) {
        document.getElementById("EmailAddress").innerHTML = " ** Invalid Email";
        return false;
      }
      else{
        document.getElementById("EmailAddress").innerHTML =""
      }


      if (
        emailAddress.charAt(emailAddress.length - 4) != "." &&
        emailAddress.charAt(emailAddress.length - 3) != "."
      ) {
        document.getElementById("EmailAddress").innerHTML = " ** Invalid Email";
        return false;
      } 
      else{
        document.getElementById("EmailAddress").innerHTML =""
      }


      

      if(phonenumber==""){
        document.getElementById("PhoneNumber").innerHTML =
        " **  fill the phonenumber field";
      return false;
      }
      else{
        document.getElementById("PhoneNumber").innerHTML =""
      }
      if (isNaN(phonenumber)) {
        document.getElementById("PhoneNumber").innerHTML =
          " ** user must write digits only not characters";
        return false;
      }
      else{
        document.getElementById("PhoneNumber").innerHTML =""
      }

      if (phonenumber.length != 10) {
        document.getElementById("PhoneNumber").innerHTML =
          " ** Mobile Number must be 10 digits only";
        return false;
      } 
      else{
        document.getElementById("PhoneNumber").innerHTML =""
      }   
      if (password == "") {
      document.getElementById("Password").innerHTML =
        " **  fill the password field";
      return false;
    }
    else{
      document.getElementById("PhoneNumber").innerHTML =""
    }
    if (password.length <= 5 || password.length > 10) {
      document.getElementById("Password").innerHTML =
        " ** Passwords lenght must be between  5 and 10";
      return false;
    }
    else{
      document.getElementById("PhoneNumber").innerHTML =""
    }

    if (password != confirmPassword) {
      document.getElementById("ConfirmPassword").innerHTML =
        " ** Password does not match the confirm password";
      return false;
    }
    else{
      document.getElementById("PhoneNumber").innerHTML =""
    }
    
  }


      // login validation

  function loginvalidation() {
      var  email= document.getElementById("email").value;
      var pass= document.getElementById("pass").value;
  
      if(email==""){
          document.getElementById("EmailAddress").innerHTML =
          " ** Please enter the Email ";
        return false;
        }
  
        if (email.indexOf("@") <= 0) {
          document.getElementById("EmailAddress").innerHTML = " ** Invalid Email";
          return false;
        }
  
        if (
          email.charAt(email.length - 4) != "." &&
          email.charAt(email.length - 3) != "."
        ) {
          document.getElementById("EmailAddress").innerHTML = " ** Invalid Email";
          return false;
        }
  
        if (pass== "") {
          document.getElementById("Password").innerHTML =
            " ** Please fill the password field";
          return false;
        }
      }



      // login validation OTP
    

      function loginvalidationOTP(){
        
        var phonenumber=document.getElementById("phonenumber").value;
        

        if(phonenumber==""){
          document.getElementById("PhoneNumber").innerHTML =
          " **  fill the phonenumber field";
        return false;
        }
        if (isNaN(phonenumber)) {
          document.getElementById("PhoneNumber").innerHTML =
            " ** user must write digits only not characters";
          return false;
        }
        if (phonenumber.length != 10) {
          document.getElementById("PhoneNumber").innerHTML =
            " ** Mobile Number must be 10 digits only";
          return false;
        }

      }


      // forgot password

      function resetpassword(){
        

        var phonenumber=document.getElementById("phonenumber").value;
        

        if(phonenumber==""){
          document.getElementById("PhoneNumber").innerHTML =
          " **  fill the phonenumber field";
        return false;
        }
        if (isNaN(phonenumber)) {
          document.getElementById("PhoneNumber").innerHTML =
            " ** user must write digits only not characters";
          return false;
        }
        if (phonenumber.length != 10) {
          document.getElementById("PhoneNumber").innerHTML =
            " ** Mobile Number must be 10 digits only";
          return false;
        }
        
        
      }
    

      function resentpassconf(){
        var password = document.getElementById("password").value;
        var  confirmPassword = document.getElementById("confirmPassword").value;
         
        if (password == "") {
          document.getElementById("Password").innerHTML =
            " **  fill the password field";
          return false;
        }
        if (password.length <= 5 || password.length > 10) {
          document.getElementById("Password").innerHTML =
            " ** Passwords lenght must be between  5 and 10";
          return false;
        }
    
        if (password != confirmPassword) {
          document.getElementById("ConfirmPassword").innerHTML =
            " ** Password does not match the confirm password";
          return false;
        }
      }
     

       // adding address on profile

      function validationaddress() {
        var CustomerFirstName = document.getElementById("input-firstname").value;
        var CustomerLastName = document.getElementById("input-lastname").value;
        var emailAddress = document.getElementById("input-email").value;
        var phonenumber = document.getElementById("input-telephone").value;
        var buldingname = document.getElementById("input-buldingname").value;
        var city = document.getElementById("input-city").value;
        var post = document.getElementById("input-postcode").value;
        var country = document.getElementById("input-country").value;
        var state = document.getElementById("input-state").value;
    
    
    
    
        if (CustomerFirstName == "") {
          document.getElementById("FirstName").innerHTML =
            " ** Please fill the username field";
          return false;
        }else{
           document.getElementById("FirstName").innerHTML =""
        }
    
        if (CustomerFirstName.length <= 2 || CustomerFirstName.length > 20) {
          document.getElementById("FirstName").innerHTML =
            " ** Username lenght must be between 2 and 10";
          return false;
        }else{
           document.getElementById("FirstName").innerHTML =""
        }
    
    
        if (!isNaN(CustomerFirstName)) {
          document.getElementById("FirstName").innerHTML =
            " ** only characters are allowed";
          return false;
        }else{
           document.getElementById("FirstName").innerHTML =""
        }
    
        if (CustomerLastName == "") {
          document.getElementById("LastName").innerHTML =
            " ** Please fill the  field";
          return false;
        }else{
           document.getElementById("LastName").innerHTML =""
        }
    
    
        if (emailAddress == "") {
          document.getElementById("EmailAddress").innerHTML =
            " ** Please fill the Email ";
          return false;
        }else{
           document.getElementById("EmailAddress").innerHTML =""
        }
    
        if (emailAddress.indexOf("@") <= 0) {
          document.getElementById("EmailAddress").innerHTML = " ** Invalid Email";
          return false;
        }else{
           document.getElementById("EmailAddress").innerHTML =""
        }
    
        if (
          emailAddress.charAt(emailAddress.length - 4) != "." &&
          emailAddress.charAt(emailAddress.length - 3) != "."
        ) {
          document.getElementById("EmailAddress").innerHTML = " ** Invalid Email";
          return false;
        }else{
           document.getElementById("EmailAddress").innerHTML =""
        }
    
        if (phonenumber == "") {
          document.getElementById("PhoneNumber").innerHTML =
            " **  fill the phonenumber field";
          return false;
        }else{
           document.getElementById("PhoneNumber").innerHTML =""
        }
        if (isNaN(phonenumber)) {
          document.getElementById("PhoneNumber").innerHTML =
            " ** user must write digits only not characters";
          return false;
        }else{
           document.getElementById("PhoneNumber").innerHTML =""
        }
        if (phonenumber.length != 10) {
          document.getElementById("PhoneNumber").innerHTML =
            " ** Mobile Number must be 10 digits only";
          return false;
        }else{
           document.getElementById("PhoneNumber").innerHTML =""
        }
    
        if (buldingname == "") {
          document.getElementById("BuldingName").innerHTML =
            " ** Please fill the buldingname field";
          return false;
        }else{
           document.getElementById("BuldingName").innerHTML =""
        }
    
    
        if (city == "") {
          document.getElementById("City").innerHTML =
            " ** Please fill the Cityname field";
          return false;
        }
        else{
           document.getElementById("City").innerHTML =""
        }
    
        if (post == "") {
          document.getElementById("Post").innerHTML =
            " ** Please fill the Post field";
          return false;
        }else{
           document.getElementById("Post").innerHTML =""
        }
        if (country == "") {
          document.getElementById("Country").innerHTML =
            " ** Please fill the Countryname field";
          return false;
        }else{
           document.getElementById("Country").innerHTML =""
        }
        if (state == "") {
          document.getElementById("State").innerHTML =
            " ** Please fill the Statename field";
          return false;
        }else{
           document.getElementById("State").innerHTML =""
        }
    
    
    
      }
      
            
       // adding address on checkout page

      function validationaddress() {
        var CustomerFirstName = document.getElementById("input-firstname").value;
        var CustomerLastName = document.getElementById("input-lastname").value;
        var emailAddress = document.getElementById("input-email").value;
        var phonenumber = document.getElementById("input-telephone").value;
        var buldingname = document.getElementById("input-buldingname").value;
        var city = document.getElementById("input-city").value;
        var post = document.getElementById("input-postcode").value;
        var country = document.getElementById("input-country").value;
        var state = document.getElementById("input-state").value;
    
    
    
    
        if (CustomerFirstName == "") {
          document.getElementById("FirstName").innerHTML =
            " ** Please fill the username field";
          return false;
        }else{
           document.getElementById("FirstName").innerHTML =""
        }
        if (CustomerFirstName.length <= 2 || CustomerFirstName.length > 20) {
          document.getElementById("FirstName").innerHTML =
            " ** Username lenght must be between 2 and 10";
          return false;
        }else{
           document.getElementById("FirstName").innerHTML =""
        }
        if (!isNaN(CustomerFirstName)) {
          document.getElementById("FirstName").innerHTML =
            " ** only characters are allowed";
          return false;
        }else{
           document.getElementById("FirstName").innerHTML =""
        }
        if (CustomerLastName == "") {
          document.getElementById("LastName").innerHTML =
            " ** Please fill the  field";
          return false;
        }else{
           document.getElementById("LastName").innerHTML =""
        }
        if (emailAddress == "") {
          document.getElementById("EmailAddress").innerHTML =
            " ** Please fill the Email ";
          return false;
        }else{
           document.getElementById("EmailAddress").innerHTML =""
        }
    
        if (emailAddress.indexOf("@") <= 0) {
          document.getElementById("EmailAddress").innerHTML = " ** Invalid Email";
          return false;
        }else{
           document.getElementById("EmailAddress").innerHTML =""
        }
    
        if (
          emailAddress.charAt(emailAddress.length - 4) != "." &&
          emailAddress.charAt(emailAddress.length - 3) != "."
        ) {
          document.getElementById("EmailAddress").innerHTML = " ** Invalid Email";
          return false;
        }else{
           document.getElementById("EmailAddress").innerHTML =""
        }
    
    
        if (phonenumber == "") {
          document.getElementById("PhoneNumber").innerHTML =
            " **  fill the phonenumber field";
          return false;
        }else{
           document.getElementById("PhoneNumber").innerHTML =""
        }
        if (isNaN(phonenumber)) {
          document.getElementById("PhoneNumber").innerHTML =
            " ** user must write digits only not characters";
          return false;
        }else{
           document.getElementById("PhoneNumber").innerHTML =""
        }
        if (phonenumber.length != 10) {
          document.getElementById("PhoneNumber").innerHTML =
            " ** Mobile Number must be 10 digits only";
          return false;
        }else{
           document.getElementById("PhoneNumber").innerHTML =""
        }
    
        if (buldingname == "") {
          document.getElementById("BuldingName").innerHTML =
            " ** Please fill the buldingname field";
          return false;
        }else{
           document.getElementById("BuldingName").innerHTML =""
        }
    
        if (city == "") {
          document.getElementById("City").innerHTML =
            " ** Please fill the Cityname field";
          return false;
        }else{
           document.getElementById("City").innerHTML =""
        }
        if (post == "") {
          document.getElementById("Post").innerHTML =
            " ** Please fill the Post field";
          return false;
        }else{
           document.getElementById("Post").innerHTML =""
        }
        if (country == "") {
          document.getElementById("Country").innerHTML =
            " ** Please fill the Countryname field";
          return false;
        }else{
           document.getElementById("Country").innerHTML =""
        }
        if (state == "") {
          document.getElementById("State").innerHTML =
            " ** Please fill the Statename field";
          return false;
        }else{
           document.getElementById("State").innerHTML =""
        }
    
    
    
      }


      // profile photo in my profile

      function fileValidation() {
        const imagebox = document.getElementById('image-box1')
        const crop_btn = document.getElementById('crop-btn1')
        var fileInput = document.getElementById('file1');

        var filePath = fileInput.value;
        var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        if (!allowedExtensions.exec(filePath)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please upload image only!',

            })
            fileInput.value = '';
            return false;
        } else {
            //Image preview
            const img_data = fileInput.files[0]
            const url = URL.createObjectURL(img_data)
            imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
            const image = document.getElementById('image')
            document.getElementById('image-box1').style.display = 'block'
            document.getElementById('crop-btn1').style.display = 'block'
            document.getElementById('confirm-btn').style.display = 'none'

            const cropper = new Cropper(image, {
                autoCropArea: 1,
                viewMode: 1,
                scalable: false,
                zoomable: false,
                movable: false,
                aspectRatio: 16 / 19,
                //  preview: '.preview',
                minCropBoxWidth: 180,
                minCropBoxHeight: 240,
            })
            crop_btn.addEventListener('click', () => {
                cropper.getCroppedCanvas().toBlob((blob) => {
                    let fileInputElement = document.getElementById('file1');
                    let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                    let container = new DataTransfer();

                    container.items.add(file);
                    const img = container.files[0]
                    var url = URL.createObjectURL(img)
                    fileInputElement.files = container.files;
                    document.getElementById('imgview1').src = url
                    document.getElementById('image-box1').style.display = 'none'
                    document.getElementById('crop-btn1').style.display = 'none'
                    document.getElementById('confirm-btn').style.display = 'block'
                }, 'image/webp', 0.5);
            });
        }
    }
