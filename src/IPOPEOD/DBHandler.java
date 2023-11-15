package IPOPEOD;

import java.sql.*;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Set;

public class DBHandler {
	public static Connection DB = DBconnect("jdbc:mysql://localhost:3306/JavaTest", "root");
	Main func = new Main();
	
	public static void main(String[] args) {
		try {
		} catch(Exception e) {
			System.out.println("error -> : "+e);
		}
	}
	
	public static Connection DBconnect(String URL, String user) {
		try { 
			Class.forName("com.mysql.cj.jdbc.Driver");
			Connection connection = DriverManager.getConnection(URL, user, "");
			return connection;
		} catch (Exception e) {
			System.out.println("connection failure ! -> " + e)  ;
		}
		return null;
	}
	
	public static ArrayList<LinkedHashMap<String, String>> getAllUsers(Connection DB) {
        ArrayList<LinkedHashMap<String, String>> listOfUsers = new ArrayList<LinkedHashMap<String, String>>();
        try {
            Statement st = DB.createStatement();
            String req = "SELECT * FROM users";
            ResultSet res = st.executeQuery(req);
            while(res.next()) {
            	LinkedHashMap<String,String> users = new LinkedHashMap<String,String>();
                users.put("id",res.getString("id"));
                users.put("login", res.getString("login"));
                users.put("email", res.getString("email"));
                users.put("blocked", String.valueOf(res.getInt("blocked")));
                listOfUsers.add(users);
            }
            return listOfUsers;
        } catch (Exception e) {
            System.out.println("error trying to fetch data from DB -> "+e);
        }
        return null;
	}
	
	public static int insertInDatabase(String table, LinkedHashMap<String,String> data) {
		try {
			Connection DB = DBconnect("jdbc:mysql://localhost:3306/JavaTest", "root");
			Set<String> keys = data.keySet();
			Collection<String> values = data.values();
			String req = "INSERT INTO "+table+" ("+String.join(",", keys)+") VALUES ('"+String.join("', '", values)+"')";
			PreparedStatement st = DB.prepareStatement(req);
			int res = st.executeUpdate();
			DB.close();
			return res;
		} catch(Exception e) {
			System.out.println("Error occured -> : "+e);
		}
		return 0;
	}
	
	public static void removeStudent(int toRemoveID) {
		try {
			Connection DB = DBconnect("jdbc:mysql://localhost:3306/JavaTest", "root");
			String req = "DELETE FROM etudiants WHERE id= "+toRemoveID;
			PreparedStatement st = DB.prepareStatement(req);
			int res = st.executeUpdate();
			DB.close();
		} catch(Exception e) {
			System.out.println("Error occured -> : "+e);
		}
	}
	
	public static ArrayList<LinkedHashMap<String,String>> getUserWithParam(String[] params) {
		try {
			Connection DB = DBconnect("jdbc:mysql://localhost:3306/JavaTest", "root");
			ArrayList<LinkedHashMap<String, String>> listOfUsers = new ArrayList<LinkedHashMap<String, String>>();
			Statement st = DB.createStatement();
			String req = "SELECT * FROM users WHERE "+params[0]+"='"+params[1]+"'";
			ResultSet res = st.executeQuery(req);
			while(res.next()) {
				LinkedHashMap<String,String> users = new LinkedHashMap<String,String>();
				users.put("id",res.getString("id"));
                users.put("login", res.getString("login"));
                users.put("email", res.getString("email"));
                users.put("password", res.getString("password"));
                users.put("blocked", String.valueOf(res.getInt("id")));
                listOfUsers.add(users);
				}
			return listOfUsers;
			} catch (Exception e) {
				System.out.println("error trying to fetch data from DB -> "+e);
				}
		return null;
		}
	
	public static void DisplayAll() {
		ArrayList<String> colName = new ArrayList<String>(Arrays.asList("id", "nom", "prenom", "data_naissance", "email", "matricule"));
		ArrayList<ArrayList<String>> toDisplay = new ArrayList<ArrayList<String>>();
		toDisplay.add(colName);
		for(LinkedHashMap<String, String> stud : DBHandler.getAllUsers(DBHandler.DB)) {
			Collection<String> temp = stud.values();
			ArrayList<String> values = new ArrayList<String>(temp);
			toDisplay.add(values);	
		}
		// System.out.println(Main.formatAsTable(toDisplay));
	}
	
	public static void BlockAccount(String id) {
		try {
			Connection DB = DBconnect("jdbc:mysql://localhost:3306/JavaTest", "root");
			String req =  "UPDATE users SET blocked = 1 WHERE id="+id;
			Statement st = DB.createStatement();
			int res = st.executeUpdate(req);
			DB.close();
		} catch(Exception e) {
			System.out.println("Error occured durind blockAccount -> "+e);
		}
	}
	
	public void ModifyPassword(String id, String newPassword) {
		try {
			Connection DB = DBconnect("jdbc:mysql://localhost:3306/JavaTest", "root");
			String req =  "UPDATE users SET password = '"+newPassword+"' WHERE id="+id;
			Statement st = DB.createStatement();
			int res = st.executeUpdate(req);
			DB.close();
		} catch(Exception e) {
			System.out.println("Error occured durind blockAccount -> "+e);
		}
	}
}
 