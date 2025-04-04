namespace Blog.Shared
{
    public class Contact
    {
        public int Id {get; set; }
        public string Name {get; set; } = string.Empty;
        public string Email {get; set; } = string.Empty;
        public string Message {get; set; } = string.Empty;
        public string Number {get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}