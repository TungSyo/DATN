package User.ChangePass;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class ChangePass_Page {
	public WebDriver driver;

	@FindBy(xpath = "(//a[@class='nav-link'][contains(.,'Đổi mật khẩu')])[1]")
	public WebElement linkChangPass;

	@FindBy(xpath = "//input[contains(@id,'oldPassword')]")
	public WebElement txtOldPass;

	@FindBy(xpath = "//input[contains(@id,'newPassword')]")
	public WebElement txtNewPass;

	@FindBy(xpath = "//span[@class='p-button-label'][contains(.,'XÁC NHẬN')]")
	public WebElement btnComfirm;
	
	public ChangePass_Page(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}
}
 