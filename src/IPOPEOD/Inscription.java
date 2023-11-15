package IPOPEOD;

import java.util.Scanner;
import java.util.regex.Pattern;

public class Inscription {
	public static Scanner userInput = new Scanner(System.in);
	Menu menu = new Menu();
	
	public void InscriptionMenu() {
		System.out.println("Please enter your login :");
		String userLogin = userInput.nextLine();
		System.out.println("Please enter your password :");
		String userPassword = userInput.nextLine();
		String userEmail = "";
		System.out.println("Please enter your email :");
		while(userEmail == "" ) {
			String temp = userInput.nextLine();
			if (EmailVerification(temp)) {
				userEmail = temp;
			} else {
				System.out.println("Please enter a valid email adress :");
			}
		}
		User user = new User(userLogin, userPassword, userEmail);
		user.addUser();
		System.out.println("Your account as been successfully created");
		menu.MainMenu();
	}
	
	public Boolean EmailVerification(String email) {
		String regexPattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" 
		        + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
		return Pattern.compile(regexPattern).matcher(email).matches();
	}
}
