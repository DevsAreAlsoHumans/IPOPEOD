package IPOPEOD;

import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.LinkedHashMap;
import java.util.Scanner;


public class Menu {
	
	public static Scanner userInput = new Scanner(System.in);
	public DBHandler DB = new DBHandler();
	
	public void MainMenu() {
		switch(MenuGenerator("Que voulez vous faire ?", new String[]  {"Vous connectez à votre compte", "Vous inscrire", "Quitter"})) {
		case(1):
			Connexion connec = new Connexion();
			connec.ConnexionMenu();
			break;
		case(2):
			Inscription inscr = new Inscription();
			inscr.InscriptionMenu();
		case(3):
			System.out.println("Merci de votre visite");
			System.exit(0);
			break;
		}
	}
	
	public void ConnectedMenu(ArrayList<LinkedHashMap<String, String>> userInfos) {
		switch(MenuGenerator("Bonjour "+userInfos.get(0).get("login")+" vous êtes connecté, que souhaitez vous faire :", new String[] {"Changer votre mot de passe", "Vous déconnecter", "Quitter"})) {
		case(1):
			ModifyPasswordMenu(userInfos);
			break;
		case(2):
			System.out.println("Vous êtes maintenant déconnecter");
			MainMenu();
			break;
		case(3):
			System.exit(0);
			break;
		};
	}
	
	public void ModifyPasswordMenu(ArrayList<LinkedHashMap<String, String>> userInfos) {
		System.out.println("Entrez votre nouveau mot de passe :");
		userInput.nextLine();
		String newPass = userInput.nextLine();
		System.out.println("Confirmer le mot de passe :");
		String confPass = userInput.nextLine();
		if (!newPass.equals(confPass)) {
			while(!newPass.equals(confPass)) {
				System.out.println("Please enter the same password :");
				confPass = userInput.nextLine();
			}
		} else {
			DB.ModifyPassword(userInfos.get(0).get("id"), newPass);
			System.out.println("Your password has been successfully modified");
			MainMenu();
		}
	}
	
	public int MenuGenerator(String question, String[] options) {
		System.out.println(question);
		for(int i=0; i<options.length; i++) {
			System.out.println("\t"+(i+1)+" -> "+options[i]);
		}
		int userChoice=0;
		while(userChoice < 1 || userChoice > options.length) {
			try {
				userChoice = userInput.nextInt();
			} catch(InputMismatchException e) {
				System.out.println("Veuillez choisir une des options proposée(s)");
				userInput.nextLine();
				userChoice=0;
			}
			if (userChoice <1 || userChoice > options.length) {
				System.out.println("Veuillez choisir une des options proposée(s)");
			}
		}
		return userChoice;
	}
}
