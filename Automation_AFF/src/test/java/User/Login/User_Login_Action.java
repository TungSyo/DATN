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

	public void enterText(WebElement element, String text) {
		baseAction.clearAndEnterText(element, text);
	}

	public void clickButton(WebElement element) {
		baseAction.clickElement(element);
	}

	public void login(String email, String password) {
		clickButton(basePage.btnAccount);
		enterText(basePage.txtUUser, email);
		enterText(basePage.txtUPass, password);
		clickButton(basePage.btnULogin);
	}

	public boolean verifyNotion(String expectedText) {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
		try {
			WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(
					By.xpath("//*[normalize-space(text())='" + expectedText + "']")));
			return element != null && element.isDisplayed();
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

	public List<Object[]> getTestData() {
		List<Object[]> testData = new ArrayList<>();
		String filePath = "src/test/resources/data/AFF_U_Data.xlsx";

		try (FileInputStream fileInputStream = new FileInputStream(new File(filePath));
				Workbook workbook = new XSSFWorkbook(fileInputStream)) {
			Sheet sheet = workbook.getSheet("Login");

			for (int i = 1; i <= sheet.getLastRowNum(); i++) {
				Row row = sheet.getRow(i);
				if (row != null) {
					String expectedTitle = row.getCell(3).getStringCellValue();
					String expectedLink = row.getCell(4).getStringCellValue().trim();
					testData.add(new Object[] { expectedTitle, expectedLink });
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		return testData;
	}
}