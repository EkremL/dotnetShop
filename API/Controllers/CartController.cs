using API.Data;
using API.DTO;
using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class CartController : ControllerBase
{
    private readonly DataContext _context;
    public CartController(DataContext context)
    {
        _context = context;
    }

    // [Authorize]
    [HttpGet]
    public async Task<ActionResult<CartDTO>> GetCart()
    {
        //geriye tip döndürdügümüz icin ıactionresult yerine actionresult döndürüyoruz
        //  var cart = await GetOrCreate(); //2 altta olusturdugumuz function

        // return CartToDTO(cart); //cart ı dto ya çevirip döndürüyoruz

        return CartToDTO(await GetOrCreate(GetCustomerId())); //üsttekiyle aynı islev

    }

    [HttpPost]
    public async Task<ActionResult> AddItemToCart(int productId, int quantity)
    {
        var cart = await GetOrCreate(GetCustomerId()); //altta olusturdugumuz function

        var product = await _context.Products.FirstOrDefaultAsync(i => i.Id == productId);

        if (product == null)
            return NotFound("the product is not found in database");

        cart.AddItem(product, quantity);

        var result = await _context.SaveChangesAsync() > 0; //0'dan büyükse başarılı demektir yani true gelecek

        if (result)
            return CreatedAtAction(nameof(GetCart), CartToDTO(cart)); //status 201 döndürür, yani created demektir (yukarıdaki getcart ı getiriyor)

        return BadRequest(new ProblemDetails { Title = "The product can not be added to cart" }); //hata oldugu durum
    }

    private string GetCustomerId(){
        return User.Identity?.Name ?? Request.Cookies["customerId"]!;
    }

//bu bir endpoint değil, yardımcı bir function, üstteki icin. kart var mı yok mu emin olmamız lazım varsa dbden alcaz yoksa olusturcaz
    private async Task<Cart> GetOrCreate(string custId)
    {
        var cart = await _context.Carts
                    .Include(i => i.CartItems)
                    .ThenInclude(i => i.Product)
                    // .Where(i => i.CustomerId == Request.Cookies["customerId"])
                    .Where(i => i.CustomerId == custId)
                    .FirstOrDefaultAsync();

        if (cart == null)
        {
            // var customerId = Guid.NewGuid().ToString();
            var customerId = User.Identity?.Name;

            if(string.IsNullOrEmpty(customerId)){
                customerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions
                {
                    Expires = DateTime.Now.AddMonths(1), //1 aylık
                    IsEssential = true //önemli bir cookie olduunu belirtiyoruz
                };

                Response.Cookies.Append("customerId", customerId, cookieOptions);
            }

            cart = new Cart { CustomerId = customerId };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        return cart;
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteItemFromCart(int productId, int quantity)
    {
        var cart = await GetOrCreate(GetCustomerId());

        cart.DeleteItem(productId, quantity);

        var result = await _context.SaveChangesAsync() > 0;

        if (result) return CreatedAtAction(nameof(GetCart), CartToDTO(cart));

        return BadRequest(new ProblemDetails { Title = "Problem removing item from the cart" });
    }

//olusturdugumuz data transfer object icin method
      private CartDTO CartToDTO(Cart cart)
    {
        return new CartDTO
        {
            CartId = cart.CartId,
            CustomerId = cart.CustomerId,
            CartItems = cart.CartItems.Select(item => new CartItemDTO
            {
                ProductId = item.ProductId,
                Name = item.Product.Name,
                Price = item.Product.Price ?? 0m,
                Quantity = item.Quantity,
                ImageUrl = item.Product.ImageUrl
            }).ToList()
        };
    }
}