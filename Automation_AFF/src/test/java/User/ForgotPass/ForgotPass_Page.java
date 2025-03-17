package User.ForgotPass;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class ForgotPass_Page {
	public WebDriver driver;

	@FindBy(xpath = "//input[contains(@id,'user')]")
	public WebElement txtEmailForgot;

	@FindBy(xpath = "//a[contains(.,'Quay lại đăng nhập')]")
	public WebElement linkBackLogin;

	@FindBy(xpath = "//span[contains(.,'Lấy mã OTP')]")
	public WebElement btnGetOTP;

	@FindBy(xpath = "//span[contains(.,'Đến trang đặt lại mật khẩu')]")
	public WebElement btnToResetPass;

	@FindBy(xpath = "//input[contains(@placeholder,'Mật khẩu mới')]")
	public WebElement txtNewPass;

	@FindBy(xpath = "//input[contains(@id,'confirmPassword')]")
	public WebElement txtConfirmPass;

	@FindBy(xpath = "//input[contains(@id,'otp')]")
	public WebElement txtOTP;

	@FindBy(xpath = "//a[@href='/resend-email-otp']")
	public WebElement linkResendOTP;

	@FindBy(xpath = "//span[@class='p-button-label'][contains(.,'XÁC NHẬN')]")
	public WebElement btnConfirm;

	public ForgotPass_Page(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}
}
