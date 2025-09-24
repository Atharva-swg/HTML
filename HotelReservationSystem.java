import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.Scanner;
import java.sql.SQLException;
import java.util.stream.StreamSupport;

public class HotelReservationSystem {

    private static final String url = "jdbc:mysql://localhost:3306/hotel_db";
    private static final String username = "root";
    private static final String pass = "root";

    public static void main(String[]args) throws ClassNotFoundException, SQLException{

        try {
            Connection conn = DriverManager.getConnection(url, username, pass);
            System.out.println("Connection Successful");

            while (true) {
                System.out.println();
                System.out.println("Welcome to Hotel Management System!!!");
                Scanner v = new Scanner(System.in);
                System.out.println("1. Reserve a room.");
                System.out.println("2. View Reservations.");
                System.out.println("3. Get Room Number.");
                System.out.println("4. Update Reservations.");
                System.out.println("5. Delete Reservations.");
                System.out.println("6. Exit");

                int choice = v.nextInt();

                switch(choice){
                    case 1:
                        resereRoom(conn, v);
                        break;
                    case 2:
                        veiwReservation(conn);
                        break;
                    case 3:
                        getRoomNumber(conn, v);
                        break;
                    case 4:
                        updateReservation(conn, v);
                        break;
                    case 5:
                        deleteReservation(conn, v);
                        break;
                    case 6:
                        exit();
                        v.close();
                        return;
                    default:
                        System.out.println("Invalid Choice!! Please Try Again");

                }
            }

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        catch(InterruptedException e){
            throw new RuntimeException();
        }
    }

    //First Function Starts Here.
    private static void resereRoom(Connection conn, Scanner v) throws SQLException{

        try{
            System.out.println("Enter Guest Name: ");
            String guest_name = v.next();
            System.out.println("Enter Room Number: ");
            int roomNumber = v.nextInt();
            System.out.println("Enter Phone Number: ");
            String contactNumber = v.next();

            String sql = ("INSERT INTO reservations (guest_name, room_namber, contact_number)" +
                    "VALUES ('" +guest_name + "'," + roomNumber + ",'" + contactNumber + "')");

            try(Statement stmt = conn.createStatement()){
                int affectedRows = stmt.executeUpdate(sql);

                if(affectedRows>0){
                    System.out.println("Reservation Successful!!");
                }
                else{
                    System.out.println("Reservation Failed!!");
                }
            }

        }
        catch(SQLException e){
            e.printStackTrace();
        }
    }
    //First Function Ends Here.

    //Second Function Starts Here.
    private static void veiwReservation(Connection conn) throws SQLException{

        String sql = "SELECT reservation_id, guest_name, room_namber, contact_number, reservation_date FROM reservations";

        try(Statement stmt = conn.createStatement();ResultSet rs = stmt.executeQuery(sql)){

            System.out.println("Current Reservations: ");
            System.out.println("+-----------------+----------------+-------------+----------------+-------------------+");
            System.out.println("| Reservation ID |     Guest      | Room Number | Contact Number | Reservation Date | ");
            System.out.println("+-----------------+----------------+-------------+----------------+-------------------+");

            while(rs.next()){
                int reservationID = rs.getInt("reservation_id");
                String guestName = rs.getString("guest_name");
                int roomNumber = rs.getInt("room_namber");
                String contactNumber = rs.getString("contact_number");
                String reservationDate = rs.getTimestamp("reservation_date").toString();

                System.out.printf("|  %-14d | %-15s | %-13d | %-20s | %-19s   |\n",
                        reservationID,guestName,roomNumber,contactNumber,reservationDate);
            }
            System.out.println("+-----------------+----------------+-------------+----------------+-------------------+");
        }

    }
    //Second Function Ends Here.

    //Third Function Starts Here.
    private static void getRoomNumber(Connection conn, Scanner v){

        try{
            System.out.println("Enter Reservation ID: ");
            int reservationID = v.nextInt();
            System.out.println("Enter Guest Name: ");
            String guestName = v.next();

            String sql = "SELECT room_namber FROM reservations" +
                    "WHERE reservation_id = " + reservationID +
                    "AND guest_name = '"+ guestName + "'";

            try(Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)){

                if(rs.next()){
                    int roomNumber = rs.getInt("room_namber");
                    System.out.println("Room Number for Reservation Id "+reservationID+"and Guest Name "+guestName+
                            "is: "+roomNumber);
                }
                else{
                    System.out.println("Reservation Not Found!!");
                }

            }
        }
        catch (SQLException e){
            e.printStackTrace();
        }

    }
    //Third Function Ends Here.

    //Forth Function Starts Here.
    private static void updateReservation(Connection conn, Scanner v){

        try{
            System.out.println("Enter the Guest ID: ");
            int reservationID = v.nextInt();

            if(!reservationExists(conn,reservationID)){
                System.out.println("Reservation Not Found!!");
                return;
            }

            System.out.println("Enter New Guest Name: ");
            String newGuestName = v.next();
            System.out.println("Enter new room Number: ");
            int newRoomNumber = v.nextInt();
            System.out.println("Enter new Phone Number: ");
            String newPhoneNumber = v.next();

            String sql = "UPDATE reservations SET guest_name = '" + newGuestName + "', " +
                    "room_namber = " + newRoomNumber + "," +
                    "contact_number = " + newPhoneNumber + "' " +
                    "WHERE reservation_id= " + reservationID;

            try(Statement stmt = conn.createStatement()){
                int affectedRows = stmt.executeUpdate(sql);

                if(affectedRows>0){
                    System.out.println("Successfully Updated!!");
                }else{
                    System.out.println("Updation Failed!!");
                }
            }

        }
        catch (SQLException e){
            e.printStackTrace();
        }

    }
    //Forth Function Ends Here.

    //Fifth Function Starts Here.
    private static void deleteReservation(Connection conn, Scanner v){

        try{
            System.out.println("Enter the Reservation ID to Delete: ");
            int reservationID = v.nextInt();

            if(!reservationExists(conn,reservationID)){
                System.out.println("Reservation Not Found!!");
                return;
            }

            String sql = "DELETE FROM reservations WHERE reservation_id= " + reservationID;

            try(Statement stmt = conn.createStatement()){
                int affectedRows = stmt.executeUpdate(sql);

                if(affectedRows>0){
                    System.out.println("Deleted Successfully!!");
                }else{
                    System.out.println("Deletion Failed!!");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    //Fifth Function Ends Here.


    private static boolean reservationExists(Connection conn,int reservationID){

        try{
            String sql = "SELECT reservation_id FROM reservations WHERE reservation_id = "+reservationID;
            try(Statement stmt = conn.createStatement()){
                ResultSet rs = stmt.executeQuery(sql);

                return rs.next();   //If there is a reservation it returns it.
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;   //Handle Database Errors as needed.
        }

    }

    //Sixth Function Starts Here.
    private static void exit() throws InterruptedException{

        System.out.println("Exiting System!!!");
        int i = 5;
        while(i!=0){
            System.out.println(".");
            Thread.sleep(450);
            i--;
        }
        System.out.println();
        System.out.println("Thank You For Using Hotel Management System!!");
    }
    //Fifth Function Ends Here.

}
