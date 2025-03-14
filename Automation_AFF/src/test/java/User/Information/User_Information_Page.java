package User.Information;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class User_Information_Page {
	public WebDriver driver;

	@FindBy(xpath = "(//a[@class='nav-link'][contains(.,'Thông tin người dùng')])[1]")
	public WebElement linkInfor;

	@FindBy(xpath = "//button[@class='btn-update-user'][contains(.,'Cập nhật')]")
	public WebElement btnUpdate_1;

	@FindBy(xpath = "//input[contains(@placeholder,'Tên người dùng')]")
	public WebElement txtName;

	@FindBy(xpath = "//input[contains(@placeholder,'CCCD/CMND')]")
	public WebElement txtCMND;

	@FindBy(xpath = "//input[contains(@placeholder,'Chọn tỉnh')]")
	public WebElement txtCity;

	@FindBy(xpath = "//input[contains(@placeholder,'Chọn huyện')]")
	public WebElement txtDistrict;

	@FindBy(xpath = "//input[contains(@placeholder,'Chọn xã')]")
	public WebElement txtWard;

	@FindBy(xpath = "//input[contains(@placeholder,'Địa chỉ chi tiết')]")
	public WebElement txtLocation;

	@FindBy(xpath = "//input[contains(@placeholder,'Mã số thuế cá nhân')]")
	public WebElement txtMst;

	@FindBy(xpath = "//input[contains(@type,'date')]")
	public WebElement txtDate;

	@FindBy(xpath = "//input[contains(@placeholder,'Tên ngân hàng')]")
	public WebElement txtBank;

	@FindBy(xpath = "//input[contains(@placeholder,'Số tài khoản')]")
	public WebElement txtStk;

	@FindBy(xpath = "//button[@type='submit'][contains(.,'Cập nhật')]")
	public WebElement btnUpdate_2;
	
	public User_Information_Page(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}
}
 