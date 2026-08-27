public class ReverseString {
    public static void main(String[] args) {
        String original = "Hello World";
        
        // Use StringBuilder's built-in reverse method
        String reversed = new StringBuilder(original).reverse().toString();
        
        System.out.println("Original: " + original);
        System.out.println("Reversed: " + reversed);
    }
}
