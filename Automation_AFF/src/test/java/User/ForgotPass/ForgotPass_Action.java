package User.ForgotPass;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import Base.Base_Action;
import Base.Base_Page;
import Base.Base_Test;
import Driver.Driver_Manager;
import Report.Extend_Report;
import Utils.Email_Reader;

@SuppressWarnings("unused")
public class ForgotPass_Action {
	private WebDriver driver;
	private Base_Page basePage;
	private Base_Action baseAction;
	private ForgotPass_Page forgotpassPage;
	public boolean shouldLoginGoogle = false;

	public ForgotPass_Action(WebDriver driver) {
		this.driver = driver;
		this.basePage = new Base_Page(driver);
		this.forgotpassPage = new ForgotPass_Page(driver);
		this.baseAction = new Base_Action(driver);
	}

	public void setShouldLoginGoogle(boolean value) {
		this.shouldLoginGoogle = value;
	}

	public boolean getShouldLoginGoogle() {
		return shouldLoginGoogle;
	}

	public void enterText(WebElement element, String text) {
		baseAction.clearAndEnterText(element, text);
	}

	public void clickButton(WebElement element) {
		baseAction.clickElement(element);
	}

	public boolean getText() {
		clickButton(forgotpassPage.btnGetOTP);

		try {
			clickButton(forgotpassPage.btnToResetPass);
			if (isTextPresent("THIẾT LẬP MẬT KHẨU MỚI")) {
				setShouldLoginGoogle(true);
				return true;
			} else {
				System.out.println("🚀 Không cần đăng nhập Google. Tiếp tục bước tiếp theo.");
				return true;
			}
		} catch (TimeoutException e) {
			System.err.println("⚠️ Không tìm thấy nút 'Đến trang đặt lại mật khẩu'. Hủy thao tác.");
			return false;
		}
	}

	public void getOTP(String description, String email, String pop3) {
		if (description.equals("Không điền OTP")) {
			System.out.println("Bỏ qua nhập OTP");
			return;
		}

		String otpToEnter = "";

		if (shouldLoginGoogle) {
			baseAction.sleep(3000);

			String host = "pop.gmail.com";
			String username = email;
			String password = pop3;
			System.err.println("📧 Email: " + email + ", POP3 password: " + pop3);

			try {
				System.out.println("📨 Đang kiểm tra hộp thư...");
				String emailOTP = Email_Reader.readLatestEmail(host, username, password);
				if (emailOTP != null && !emailOTP.isEmpty()) {
					System.out.println("✅ OTP lấy từ email: " + emailOTP);
					otpToEnter = emailOTP;
				} else {
					System.err.println("⚠️ Không lấy được OTP! Dùng OTP mặc định.");
				}
			} catch (Exception e) {
				System.err.println("❌ Lỗi khi đọc email: " + e.getMessage());
			}
		}

		if (description.equals("Điền OTP không hợp lệ")) {
			otpToEnter = "123456";
		}
		enterText(forgotpassPage.txtOTP, otpToEnter);
	}

	public void forgotPass(String email, String newPass, String comfirmPass, String pop3, String description) {
		clickButton(basePage.btnAccount);
		clickButton(basePage.LinkForgotPassword);
		enterText(forgotpassPage.txtEmailForgot, email);

		if (!getText()) {
			return;
		}

		enterText(forgotpassPage.txtNewPass, newPass);
		enterText(forgotpassPage.txtConfirmPass, comfirmPass);
		getOTP(description, email, pop3);
		clickButton(forgotpassPage.btnConfirm);
	}

	public boolean verifyNotion(String expectedText) {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
		try {
			List<WebElement> allElements = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
					By.xpath("//*[normalize-space(text())='" + expectedText + "']")));
			return !allElements.isEmpty();
		} catch (Exception e) {
			return false;
		}
	}

	public boolean verifyLink(String expectedLink) {
		String currentUrl = driver.getCurrentUrl();

		if (expectedLink.contains("host.docker.internal")) {
			expectedLink = expectedLink.replace("host.docker.internal", "localhost");
		}
		if (currentUrl.contains("host.docker.internal")) {
			currentUrl = currentUrl.replace("host.docker.internal", "localhost");
		}

		String decodedExpected = URLDecoder.decode(expectedLink.trim(), StandardCharsets.UTF_8);
		String decodedActual = URLDecoder.decode(currentUrl.trim(), StandardCharsets.UTF_8);

		System.out.println("[DEBUG] Expected URL: " + decodedExpected);
		System.out.println("[DEBUG] Actual URL: " + decodedActual);

		return decodedActual.equalsIgnoreCase(decodedExpected);
	}

	public boolean verifyTitle(String expectedTitle) {
		String actualTitle = driver.getTitle();
		System.out.println("[DEBUG] Expected Title: " + expectedTitle);
		System.out.println("[DEBUG] Actual Title: " + actualTitle);
		return actualTitle.equals(expectedTitle);
	}

	public List<Object[]> getSearchTestData() throws IOException {
		List<Object[]> testData = new ArrayList<>();
		String filePath = "src/test/resources/data/AFF_U_Data.xlsx";
		File file = new File(filePath);

		if (!file.exists()) {
			System.err.println("[ERROR] File not found: " + filePath);
			return testData;
		}

		try (FileInputStream fileInputStream = new FileInputStream(file);
				Workbook workbook = new XSSFWorkbook(fileInputStream)) {

			Sheet sheet = workbook.getSheet("ForgotPass");
			if (sheet == null) {
				System.err.println("[ERROR] Sheet 'Change_Pass' not found in the Excel file.");
				return testData;
			}

			for (int i = 1; i <= sheet.getLastRowNum(); i++) {
				Row row = sheet.getRow(i);
				if (row == null || row.getCell(0) == null || row.getCell(2) == null || row.getCell(3) == null)
					continue;

				String keyword = row.getCell(0).getStringCellValue();
				String expectedTitle = row.getCell(2).getStringCellValue();
				String expectedLink = row.getCell(3).getStringCellValue().trim();
				testData.add(new Object[] { keyword, expectedTitle, expectedLink });
			}
		}

		return testData;
	}

	public boolean isTextPresent(String expectedText) {
		try {
			WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(3)); // Chờ tối đa 3 giây
			WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(
					By.xpath("//*[contains(text(),'" + expectedText + "')]")));
			return element.isDisplayed();
		} catch (Exception e) {
			System.out.println("⚠️ Không tìm thấy phần tử chứa: " + expectedText + ". Tiếp tục bước tiếp theo...");
			return false;
		}
	}
}
