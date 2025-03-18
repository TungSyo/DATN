package User.SCart;
import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;


public class SCart_Page {
     public WebDriver driver;

     @FindBy(xpath = "//button[contains(.,'Thêm vào giỏ')]")
     public List<WebElement> addToCartButtons;

     

     public SCart_Page(WebDriver driver){
          this.driver = driver;
          PageFactory.initElements(driver, this);
     }
}
