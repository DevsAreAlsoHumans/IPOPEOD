package IPOPEOD;

import java.util.LinkedHashMap;

public class User {
	protected String Login;
	protected String Password;
	protected String Email;
	
	public User(String login, String password, String email) {
		this.Login = login;
		this.Password = password;
		this.Email = email;
	}
	
	public void addUser() {
		LinkedHashMap<String,String> toPush = new LinkedHashMap<>();
		toPush.put("login", this.Login);
		toPush.put("password", this.Password);
		toPush.put("email", this.Email);
		try {
			DBHandler.insertInDatabase("users", toPush);
		} catch(Exception e) {
			System.out.println("error occured -> :" + e);
		}
	}
}
