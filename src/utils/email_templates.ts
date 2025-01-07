function welcomeTemplate(to:string){
 return `<!DOCTYPE html>
 <html>
 <head>
   <style>
     body {
       font-family: Arial, sans-serif;
       margin: 0;
       padding: 0;
       background-color: #f9f9f9;
       color: #333;
       line-height: 1.6;
     }
     .container {
       max-width: 600px;
       margin: 20px auto;
       background: #ffffff;
       border-radius: 8px;
       overflow: hidden;
       box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
     }
     .header {
       background-color: #58B84F;
       padding: 20px;
       text-align: center;
       color: #ffffff;
     }
      .header h1{
      color: #ffffff;
      } 
     .header img {
       max-width: 150px;
       margin-bottom: 10px;
     }
     .content {
       padding: 20px;
     }
     .content h1 {
       color: #0073e6;
       font-size: 24px;
     }
     .content p {
       margin: 10px 0;
     }
     .features {
       margin: 20px 0;
       padding-left: 20px;
     }
     .features li {
       margin-bottom: 10px;
     }
     .cta {
       text-align: center;
       margin: 20px 0;
     }
     .cta a {
       background-color: #0073e6;
       color: #ffffff;
       text-decoration: none;
       padding: 10px 20px;
       border-radius: 5px;
       font-size: 16px;
     }
     .cta a:hover {
       background-color: #005bb5;
     }
     .footer {
       background-color: #f1f1f1;
       padding: 10px;
       text-align: center;
       font-size: 14px;
       color: #666;
     }
     .footer a {
       color: #0073e6;
       text-decoration: none;
     }
     .footer a:hover {
       text-decoration: underline;
     }
   </style>
 </head>
 <body>
   <div class="container">
     <!-- Header Section -->
     <div class="header">
       <img src="https://res.cloudinary.com/dpuaqijz4/image/upload/v1736262358/qw9z2czrktzkwno8k8fu.png" alt="9LifeBookings Logo">
       <h1>Welcome to 9LifeBookings!</h1>
     </div>
     <!-- Content Section -->
     <div class="content">
       <p>Dear ${to},</p>
       <p>
         Welcome to 9LifeBookings! We’re thrilled to have you join our community of travelers and adventurers.
       </p>
       <p>
         Whether you’re planning a luxurious escape, a serene weekend retreat, or a quick getaway, 9LifeBookings is here to connect you with the perfect rental options. From stunning villas to cozy homes and top-tier hotels, we’ve got something for every journey.
       </p>
       <h2>Here’s what you can look forward to:</h2>
       <ul class="features">
         <li><strong>Exclusive Listings:</strong> Access a diverse range of properties tailored to your travel needs.</li>
         <li><strong>Seamless Experience:</strong> Book with ease through our user-friendly platform.</li>
         <li><strong>24/7 Support:</strong> Our dedicated team is always here to assist you.</li>
       </ul>
       <p>
         If you have any questions or need assistance, feel free to contact us at <a href="mailto:support@9lifebookings.com">support@9lifebookings.com</a>.
       </p>
       <p>Thank you for choosing 9LifeBookings. We can’t wait to be a part of your travel journey!</p>
     </div>
     <!-- Footer Section -->
     <div class="footer">
       <p>Warm regards,<br>The 9LifeBookings Team</p>
       <p><a href="https://9lifebookings.com" target="_blank">Visit our website</a> | <a href="mailto:support@9lifebookings.com">Contact Support</a></p>
     </div>
   </div>
 </body>
 </html>
` 
}

function otpTemplate(otp:number, email: string){
  return `<!DOCTYPE html>
  <html>
  <body>
  <p>Someone requested to reset the password for the following account:</p>

  <p>email: ${email}</p>

  <p>If this was a mistake, just ignore this email and nothing will happen.</p>

  <p>To reset your password, use the code below to verify.</p>

  <h1>${otp}</h1>

  </body>
  </html> 
  `; 
}

function verifyEmailTemplate(otp:number, email:string, user:string){
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px 0;
        background-color: #58B84F;
        color: #ffffff;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        background-color: #58B84F;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
      }
      .footer {
        margin-top: 20px;
        padding: 10px;
        text-align: center;
        font-size: 12px;
        color: #777777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Email Verification</h1>
      </div>
      <div class="content">
        <p>Hi ${user},</p>
        <p>Thank you for registering with us. Use the code below to verify your email address: ${email}</p>
        <h1>${otp}</h1>
        <p>If you did not create an account, no further action is required.</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>  
  `; 
}


function adAlertTemplate(mail:string){
  return `<!DOCTYPE html>
  <html>
  <body>
  <p>Ad Alert</p>

  <p>${mail}</p>

  </body>
  </html> 
  `; 
}

export {welcomeTemplate, otpTemplate as otpTemplate, adAlertTemplate, verifyEmailTemplate};