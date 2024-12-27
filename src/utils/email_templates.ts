function welcomeTemplate(to:string){
 return `<!DOCTYPE html>
<html>
<body> 
<p>Dear ${to}</p>
Congratulations and welcome to Campus Mart – your go-to destination for connecting with buyers and sellers right on your school campus! We're delighted to have you as part of our community, and we're excited to see you explore the vibrant marketplace we've tailored just for your campus needs.
  Here's a glimpse of what Campus Mart has to offer:
  * 		Tailored Campus Experience:
  * 		Immerse yourself in a marketplace designed exclusively for your school community. Campus Mart brings buyers and sellers together in a convenient and local setting.
  * 		Intuitive Navigation:
  * 		Enjoy a seamless experience with our user-friendly interface. Navigate through categories effortlessly, use smart filters, and discover items with just a few clicks.
  * 		Safe and Secure Transactions:
  * 		Your safety is our priority. Campus Mart employs robust security measures to ensure all transactions are secure, providing you with a worry-free buying and selling experience.
  * 		Effortless Communication:
  * 		Connect with fellow students and sellers with ease. Our in-app messaging system allows you to negotiate prices, ask questions, and finalize details without leaving the app.
  * 		Personalized Shopping:
  * 		Experience a personalized shopping journey with recommendations tailored to your preferences and browsing history.
  To kickstart your Campus Mart journey:
  * Download the Campus Mart app from the App Store or Google Play Store.
  * Create your account using this email address: [User's Email Address]
  * Dive into the marketplace, connect with the campus community, and make transactions hassle-free.
  Should you have any inquiries or need assistance, our dedicated support team is here to help. Simply reach out to us at [Your Support Email Address].
  We're thrilled to have you join our Campus Mart family. Happy exploring!
  Best regards,
  The Campus Mart Team 
</body></html>`;
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

function verifyEmailTemplate(otp:number, email:string){
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
        background-color: #007BFF;
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
        background-color: #007BFF;
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
        <p>Hi [User],</p>
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