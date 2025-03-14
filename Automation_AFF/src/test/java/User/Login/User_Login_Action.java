package User.Login;

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
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import Base.Base_Action;
import Base.Base_Page;

public class User_Login_Action {
	private WebDriver driver;
	private Base_Page basePage;
	private Base_Action baseAction;

	public User_Login_Action(WebDriver driver) {
		this.driver = driver;
		this.basePage = new Base_Page(driver);
		this.baseAction = new Base_Action(driver);
	}

	public void enterUsername(String email) {
		baseAction.clearAndEnterText(basePage.txtUUser, email);
	}

	public void enterPassword(String password) {
		baseAction.clearAndEnterText(basePage.txtUPass, password);
	}

	public void clickLogin() {
		baseAction.clickElement(basePage.btnULogin);
	}

	public void clickRegister() {
		baseAction.clickElement(basePage.linkRegister);
	}

	public void clickForgotPassword() {
		baseAction.clickElement(basePage.LinkForgotPassword);
	}

	public void clickAccount() {
		baseAction.clickElement(basePage.btnAccount);
	}

	public void login(String email, String password) {
		clickAccount();
		enterUsername(email);
		enterPassword(password);
		clickLogin();
	}

	public boolean verifyNotion(String expectedText) {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
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

	public List<Object[]> getSearchTestData() {
		List<Object[]> testData = new ArrayList<>();
		String filePath = "src/test/resources/data/AFF_U_Data.xlsx";

		try (FileInputStream fileInputStream = new FileInputStream(new File(filePath));
				Workbook workbook = new XSSFWorkbook(fileInputStream)) {
			Sheet sheet = workbook.getSheet("Login");

			for (int i = 1; i <= sheet.getLastRowNum(); i++) {
				Row row = sheet.getRow(i);
				if (row != null) {
					String keyword = row.getCell(0).getStringCellValue();
					String expectedTitle = row.getCell(2).getStringCellValue();
					String expectedLink = row.getCell(3).getStringCellValue().trim();
					testData.add(new Object[] { keyword, expectedTitle, expectedLink });
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		return testData;
	}
}