<?php if($_POST) {
	require 'PHPMailer/src/Exception.php';
	require 'PHPMailer/src/PHPMailer.php';
	require 'PHPMailer/src/SMTP.php';

	$to_email = "YOUR_EMAIL@EXAMPLE.COM"; //Recipient email, Replace with own email here
	$subject  = "Requesting a collaboration";

	//Sanitize input data using PHP filter_var().
	$user_name		= filter_var( $_POST["name"], FILTER_SANITIZE_STRING );
	$user_email		= filter_var( $_POST["email"], FILTER_SANITIZE_EMAIL );
	$message		= filter_var( $_POST["message"], FILTER_SANITIZE_STRING );

	//additional php validation
	if(strlen($user_name) < 2){ // If length is less than 2 it will output JSON error.
		$output = json_encode(array('type'=>'error', 'text' => 'Name is too short or empty!'));
		die($output);
	}
	if(!filter_var($user_email, FILTER_VALIDATE_EMAIL)){ //email validation
		$output = json_encode(array('type'=>'error', 'text' => 'Please enter a valid email!'));
		die($output);
	}

	//Create a new PHPMailer instance
	$mail = new PHPMailer\PHPMailer\PHPMailer();

	/**
	 * START SMTP SETUP
	 * ENABLE SMTP IF YOU HAVE AN SMTP SERVER
	 */
	//Tell PHPMailer to use SMTP
	// $mail->isSMTP();

	//Enable SMTP debugging
	//SMTP::DEBUG_OFF = off (for production use)
	//SMTP::DEBUG_CLIENT = client messages
	//SMTP::DEBUG_SERVER = client and server messages
	// $mail->SMTPDebug = SMTP::DEBUG_SERVER;

	//Set the hostname of the mail server
	// $mail->Host = 'mail.example.com';

	//Set the SMTP port number - likely to be 25, 465 or 587
	// $mail->Port = 25;

	//Whether to use SMTP authentication
	// $mail->SMTPAuth = true;

	//Username to use for SMTP authentication
	// $mail->Username = 'yourname@example.com';

	//Password to use for SMTP authentication
	// $mail->Password = 'yourpassword';

	/** END SMPT SETUP */

	//Set who the message is to be sent from
	$mail->setFrom($user_email, $user_name);

	//Set an alternative reply-to address
	// $mail->addReplyTo('replyto@example.com', $user_name);

	//Set who the message is to be sent to
	$mail->addAddress($to_email, 'Liquid Themes');

	//Set the subject line
	$mail->Subject = $subject;

	// Setting email body to a plain text
	$mail->isHTML(false);
	$mail->Body = $message;

	//Read an HTML message body from an external file, convert referenced images to embedded,
	//convert HTML into a basic plain-text alternative body
	// $mail->msgHTML(file_get_contents('contents.html'), __DIR__);
	//Replace the plain text body with one created manually
	// $mail->AltBody = 'This is a plain-text message body';

	//Attach an image file
	// $mail->addAttachment('images/phpmailer_mini.png');

	//send the message, check for errors
	if ( !$mail->send() ) {
		$output = json_encode(array('type'=>'error', 'text' => 'Could not send mail! Please check your PHP mail configuration. Error: ' . $mail->ErrorInfo));
		die($output);
	} else {
		$output = json_encode(array('type'=>'message', 'text' => 'Hi '.$user_name .' Thank you for your email'));
		die($output);
	}

} ?>