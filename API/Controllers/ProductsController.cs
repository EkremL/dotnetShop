using API.Data;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

//? endpoint
// [Route("/api/products")]
[ApiController]
[Route("/api/[controller]")] //üsttekiyle aynı işlevi görüyor
public class ProductsController : ControllerBase{
//!DATABASE ÖNCESİ MANUAL SEEDING 
//    // [HttpGet] yazsak da yazmasak da defaul olarak get reques algılar
//     [HttpGet]
//     //! action method
//     public IActionResult GetProducts()
//     {
//         return Ok(new List<Product>()
//         {
//             new Product
//             {
//                 Id = 1,
//                 Name = "Iphone 15",
//                 Price = 50000,
//                 Description = "Iphone telefon",
//                 ImageUrl = "1.jpg",
//                 IsActive = true,
//                 Stock = 100
//             },
//             new Product
//             {
//                 Id = 2,
//                 Name = "Iphone 16",
//                 Price = 60000,
//                 Description = "Iphone telefon",
//                 ImageUrl = "2.jpg",
//                 IsActive = true,
//                 Stock = 100
//             } //şimdilik manuel yaptık daha sonra dbdeki verileri alacağız
//         });
//     }

//     [HttpGet("{id}")] //burada mecburen belirtiyoruz api/products/1
//     public IActionResult GetProduct(int id)
//     {
//         return Ok(new Product
//         {
//             Id = 1,
//             Name = "Iphone 15",
//             Price = 50000,
//             Description = "Iphone telefon",
//             ImageUrl = "1.jpg",
//             IsActive = true,
//             Stock = 100
//         });
//     }

//! dependency injection
private readonly DataContext _context; //? dbcontexti kullanabilmek için tanımladık
    public ProductsController(DataContext context)
    {
        _context = context;  //artık bu context nesnesi üzerinden sql sorguları yazabiliriz.
    }

    //! DATABASE SONRASI DBDEN VERİ GETİRME
       // [HttpGet] yazsak da yazmasak da defaul olarak get reques algılar
    [HttpGet]
    //! action method

     //!senkron version
    // public IActionResult GetProducts()
    // {
       
    //     var products = _context.Products.ToList(); // dbden verileri alıyoruz
    //     return Ok(products); // dbden aldığımız verileri döndürüyoruz
    // }
    //!asenkron version
    public async Task<IActionResult> GetProducts()
    {
       
        var products = await _context.Products.ToListAsync(); //? dbden verileri alıyoruz
        return Ok(products); //? dbden aldığımız verileri döndürüyoruz
    }

    //!senkron version
    // [HttpGet("{id}")] //burada mecburen belirtiyoruz api/products/1
    // public IActionResult GetProduct(int id)
    // {
    //     return Ok(new Product
    //     {
    //         Id = 1,
    //         Name = "Iphone 15",
    //         Price = 50000,
    //         Description = "Iphone telefon",
    //         ImageUrl = "1.jpg",
    //         IsActive = true,
    //         Stock = 100
    //     });
    // }
    //!asenkron version
    [HttpGet("{id}")] //burada mecburen belirtiyoruz api/products/1
    public async Task<IActionResult> GetProduct(int? id)
    {
    //id kontrol etme
        if(id == null) 
        {
            return NotFound(); //404 not found döndür
        }

        //?2 yöntem var ikisi de aynı işleve sahip
        //!id ile sorgulama
        var product = await _context.Products.FindAsync(id);
        //! gelen her idye bak eşleşen varsa döndür
        //   var product = await _context.Products.FirstOrDefaultAsync(i => i.Id == id); //? idye göre veriyi buluyoruz

        if(product == null)
        {
            return NotFound(); //404 not found döndür
        }
        return Ok(product);
    }
    
 
}