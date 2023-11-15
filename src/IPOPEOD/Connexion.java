package IPOPEOD;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Scanner;

public class Connexion {
	
	public static Scanner userInput = new Scanner(System.in);
	public Menu menu = new Menu();
	
	public void ConnexionMenu() {
		System.out.println("Please enter your login :");
		String login = userInput.nextLine();
		int attempt = 0;
		ArrayList<LinkedHashMap<String, String>> userInfos = DBHandler.getUserWithParam(new String[] {"login", login});
		if (String.valueOf(userInfos.get(0).get("blocked")).equals("1")) {
			System.out.println("Sorry but your account is blocked due to a large number of connection attempt failed");
			menu.MainMenu();
		} else {
			System.out.println("Please enter your password :");
			String password = userInput.nextLine();
			while(!String.valueOf(userInfos.get(0).get("password")).equals(password) && attempt<=5) {
				System.out.println("Wrong password, please retry (remaining attempt ->"+String.valueOf(5-attempt)+") :");
				password = userInput.nextLine();
				attempt+=1;
			}
			if (attempt >= 5) {
				DBHandler.BlockAccount(userInfos.get(0).get("id"));
				System.out.println("Your account as been blocked due to a large number of failed attempt");
				menu.MainMenu();
			}
		}
		menu.ConnectedMenu(userInfos);
		return;
	}
}
