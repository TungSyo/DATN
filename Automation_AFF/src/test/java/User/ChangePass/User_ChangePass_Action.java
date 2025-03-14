package User.ChangePass;

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
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import Base.Base_Action;
import Base.Base_Page;
import Base.Base_Test;
import Report.Extend_Report;

@SuppressWarnings("unused")
public class User_ChangePass_Action {
	private WebDriver driver;
	private Base_Page basePage;
	private Base_Action baseAction;
	private User_ChangePass_Page passPage;

	public User_ChangePass_Action(WebDriver driver) {
		this.driver = driver;
		this.basePage = new Base_Page(driver);
		this.passPage = new User_ChangePass_Page(driver);
		this.baseAction = new Base_Action(driver);
	}

	public void clickChangePass() {
		baseAction.clickElement(passPage.linkChangPass);
	}

	public void clickConfirm() {
		baseAction.clickElement(passPage.btnComfirm);
	}

	public void enterOldPass(String oldpass) {
		baseAction.clearAndEnterText(passPage.txtOldPass, oldpass);
	}

	public void enterNewPass(String newpass) {
		baseAction.clearAndEnterText(passPage.txtNewPass, newpass);
	}

	public void clickAccount() {
		baseAction.clickElement(basePage.btnAccount_2);
	}

	public void changePass(String oldpass, String newpass) {
		clickAccount();
		clickChangePass();
		enterOldPass(oldpass);
		enterNewPass(newpass);
		clickConfirm();
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
		String decodedExpected = URLDecoder.decode(expectedLink.trim(), StandardCharsets.UTF_8);
		String decodedActual = URLDecoder.decode(driver.getCurrentUrl().trim(), StandardCharsets.UTF_8);
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

			Sheet sheet = workbook.getSheet("Change_Pass");
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
}
