package User.SCart;
import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;


public class SCart_Page {
     public WebDriver driver;

     @FindBy(xpath = "//input[contains(@ng-reflect-model,'1')]")
     public List<WebElement> productQuantity;

     @FindBy(xpath = "//tr[@class='order-total']/td")
     public List<WebElement> productPrice;

     @FindBy(xpath = "//div[@class='cart-product']//a")
     public List<WebElement> productName;
     

     @FindBy(xpath = "//button[contains(.,'Thêm vào giỏ')]")
     public List<WebElement> addToCartButtons;

     @FindBy(xpath = "//input[@type='checkbox']")
     public List<WebElement> addToCartCheckboxes;

     @FindBy(xpath = "//span[@class='product-trash']")
     public List<WebElement> deleteButtons;

     @FindBy(xpath = "(//input[@class='select-all-checkbox'])[1]")
     public WebElement selectAllCheckbox;
     
     @FindBy(xpath = "(//input[contains(@class,'select-all-checkbox')])[3]")
     public WebElement selectCheckboxDongy;
     
     @FindBy(xpath = "//button[contains(.,'TIỀN HÀNG THANH TOÁN')]")
     public WebElement btnToThanhToan;
     
     @FindBy(xpath = "//li[contains(@class,'header__shop-icon-item header__shop-icon-item-cart')]")
     public WebElement btnCart;

     public SCart_Page(WebDriver driver){
          this.driver = driver;
          PageFactory.initElements(driver, this);
     }
}
