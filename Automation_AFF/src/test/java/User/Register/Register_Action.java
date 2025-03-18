package User.Register;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Properties;

import org.apache.commons.io.FileUtils;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import User.Register.Register_Page;
import Base.Base_Action;
import Base.Base_Page;
import Base.Base_Test;
import User.Login.User_Login_Page;
import Utils.ConfigUtil;
import Utils.Email_Reader;
import Utils.Login_Google;
import Utils.OCRUtils;
import Utils.Otp_Extractor;
import Utils.ScreenShotUtil;

@SuppressWarnings("unused")
public class Register_Action {
    private WebDriver driver;
    private Register_Page registerPage;
    private Base_Page basePage;
    private Base_Test baseTest;
    private Base_Action baseAction;
    private User_Login_Page loginPage;
    private Login_Google loginGoogle;
    public boolean shouldLoginGoogle = false;

    public Register_Action(WebDriver driver) {
        this.driver = driver;
        this.registerPage = new Register_Page(driver);
        this.basePage = new Base_Page(driver);
        this.baseTest = new Base_Test();
        this.loginGoogle = new Login_Google(driver);
        this.loginPage = new User_Login_Page(driver);
    }

    public void setShouldLoginGoogle(boolean value) {
        this.shouldLoginGoogle = value;
    }

    public boolean getShouldLoginGoogle() {
        return shouldLoginGoogle;
    }

    public void clickTaotk() {
        clickButton(registerPage.btnTaotk);
        if (isTextPresent("XÁC THỰC OTP")) {
            setShouldLoginGoogle(true);
        } else {
            System.out.println("🚀 Không cần đăng nhập Google. Tiếp tục bước tiếp theo.");
        }
    }

    public void clickAccount() {
        clickButton(basePage.btnAccount);
        baseAction.sleep(500);

        try {
            if (basePage.btnLogout.isDisplayed()) {
                clickButton(basePage.btnLogout);
                baseAction.sleep(5000);
            }
        } catch (Exception e) {
        }
    }

    public void enterOTP(String otp) {
        clickButton(registerPage.txtOtp);

        List<WebElement> otpInputs = driver.findElements(By.xpath("//div[@class='otp-inputs']/input"));
        int length = Math.min(otp.length(), otpInputs.size());

        for (int i = 0; i < length; i++) {
            otpInputs.get(i).sendKeys(String.valueOf(otp.charAt(i)));
        }
    }

    public void enterText(WebElement element, String text) {
        baseAction.clearAndEnterText(element, text);
    }

    public void clickButton(WebElement element) {
        baseAction.clickElement(element);
    }

    public void register(String name, String sdt, String email, String cmnd, String pass, String mgt,
            String city, String district, String ward, String location, String mst,
            String date, String bank, String stk, String result, String pop3) {
        clickAccount();
        clickButton(basePage.linkRegister);
        baseAction.sleep(1000);
        enterText(registerPage.txtName, name);
        enterText(registerPage.txtSdt, sdt);
        enterText(registerPage.txtEmail, email);
        enterText(registerPage.txtCMND, cmnd);
        enterText(registerPage.txtPass, pass);
        enterText(registerPage.txtMgt, mgt);
        enterText(registerPage.txtCity, city);
        enterText(registerPage.txtDistrict, district);
        enterText(registerPage.txtWard, ward);
        enterText(registerPage.txtLocation, location);
        enterText(registerPage.txtMst, mst);
        enterText(registerPage.txtDate, date);
        enterText(registerPage.txtBank, bank);
        enterText(registerPage.txtStk, stk);
        clickButton(registerPage.cbDongy);

        clickTaotk();
        if (shouldLoginGoogle) {
            baseAction.sleep(3000);

            String host = "pop.gmail.com";
            String username = email;
            String password = pop3;
            System.err.println("Email: " + email + ", POP3 password: " + pop3);

            try {
                System.out.println("📨 Đang kiểm tra hộp thư...");

                String otp = Email_Reader.readLatestEmail(host, username, password);
                if (otp != null && !otp.isEmpty()) {
                    System.out.println("✅ OTP tìm thấy: " + otp);
                    enterOTP(otp);
                    clickButton(registerPage.btnXacnhan);
                } else {
                    System.err.println("⚠️ Không lấy được OTP!");
                }

            } catch (Exception e) {
                System.err.println("❌ Lỗi khi đọc email qua POP: " + e.getMessage());
            }
        }

    }

    public boolean verifyNotion(String result) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        boolean isTextFound = false;

        try {
            List<WebElement> allElements = wait.until(ExpectedConditions
                    .presenceOfAllElementsLocatedBy(By.xpath("//*[contains(text(), '" + result + "')]")));
            for (WebElement element : allElements) {
                String elementText = element.getText().trim();
                if (!elementText.isEmpty() && elementText.contains(result)) {
                    isTextFound = true;
                    break;
                }
            }
        } catch (Exception e) {
            isTextFound = false;
        }
        return isTextFound;
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

    public boolean verifyTitle(String title) {
        String actualTitle = driver.getTitle();
        System.out.println("[DEBUG] Expected Title: " + title);
        System.out.println("[DEBUG] Actual Title: " + actualTitle);
        return actualTitle.equals(title);
    }

    public List<Object[]> getTestData() throws IOException {
        List<Object[]> testData = new ArrayList<>();
        String filePath = "src/test/resources/data/User_Data.xlsx";
        FileInputStream fileInputStream = new FileInputStream(new File(filePath));
        Workbook workbook = new XSSFWorkbook(fileInputStream);
        Sheet sheet = workbook.getSheet("Register");

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null || row.getCell(15) == null || row.getCell(16) == null)
                continue;
            String title = row.getCell(15).getStringCellValue();
            String link = row.getCell(16).getStringCellValue().trim();
            testData.add(new Object[] { title, link });
        }

        workbook.close();
        fileInputStream.close();
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
