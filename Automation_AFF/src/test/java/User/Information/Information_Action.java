package User.Information;

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
public class Information_Action {
	private WebDriver driver;
	private Base_Page basePage;
	private Base_Action baseAction;
	private Information_Page inforPage;

	public Information_Action(WebDriver driver) {
		this.driver = driver;
		this.basePage = new Base_Page(driver);
		this.inforPage = new Information_Page(driver);
		this.baseAction = new Base_Action(driver);
	}

	public void enterText(WebElement element, String text) {
		baseAction.clearAndEnterText(element, text);
	}

	public void clickButton(WebElement element) {
		baseAction.clickElement(element);
	}

	public void updateInfor(String name, String cmnd, String city, String district, String ward, String location,
			String mst, String date, String bank, String stk) {
		
		clickButton(basePage.btnAccount_2);
		clickButton(inforPage.linkInfor);
		clickButton(inforPage.btnUpdate_1);
		enterText(inforPage.txtName, name);
		enterText(inforPage.txtCMND, cmnd);
		enterText(inforPage.txtCity, city);
		enterText(inforPage.txtDistrict, district);
		enterText(inforPage.txtWard, ward);
		enterText(inforPage.txtLocation, location);
		enterText(inforPage.txtMst, mst);
		enterText(inforPage.txtDate, date);
		enterText(inforPage.txtBank, bank);
		enterText(inforPage.txtStk, stk);
		clickButton(inforPage.btnUpdate_2);
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

	public List<Object[]> getTestData() throws IOException {
		List<Object[]> testData = new ArrayList<>();
		String filePath = "src/test/resources/data/AFF_U_Data.xlsx";
		File file = new File(filePath);

		if (!file.exists()) {
			System.err.println("[ERROR] File not found: " + filePath);
			return testData;
		}

		try (FileInputStream fileInputStream = new FileInputStream(file);
				Workbook workbook = new XSSFWorkbook(fileInputStream)) {

			Sheet sheet = workbook.getSheet("Information");
			if (sheet == null) {
				System.err.println("[ERROR] Sheet 'Information' not found in the Excel file.");
				return testData;
			}

			for (int i = 1; i <= sheet.getLastRowNum(); i++) {
				Row row = sheet.getRow(i);
				if (row == null || row.getCell(11) == null || row.getCell(12) == null)
					continue;

				String expectedTitle = row.getCell(11).getStringCellValue();
				String expectedLink = row.getCell(12).getStringCellValue().trim();
				testData.add(new Object[] { expectedTitle, expectedLink });
			}
		}

		return testData;
	}
}
