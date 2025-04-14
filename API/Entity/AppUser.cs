using Microsoft.AspNetCore.Identity;

namespace API.Entity;

public class AppUser : IdentityUser //temelde olan sınıfı genişlettik ve istedigimiz propertyleri buraya ekleyebiliriz. bunun için datacontexte IdentityDbContext<> içerisinde <> kısmına burayı tanıtıyoruz.
{
    public string? Name { get; set; }
}