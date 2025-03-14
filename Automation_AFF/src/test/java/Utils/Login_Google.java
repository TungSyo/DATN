package Utils;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import Driver.Driver_Manager;
import Base.Base_Action;
import Base.Base_Page;
import Base.Base_Test;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import Report.Extend_Report;
import org.testng.Assert;

@SuppressWarnings("unused")
public class Login_Google {
    private WebDriver driver;
    private Base_Page basePage;

    private Base_Test baseTest;

    public Login_Google(WebDriver driver) {
        this.driver = driver;
        this.basePage = new Base_Page(driver);
        this.baseTest = new Base_Test();
    }

    public void openNewTabAndAccessGoogle() {
        try {
            ((JavascriptExecutor) driver).executeScript("window.open('about:blank','_blank');");
            ArrayList<String> tabs = new ArrayList<>(driver.getWindowHandles());
            driver.switchTo().window(tabs.get(1));

            String url_email = ConfigUtil.getProperty("url_email");
            if (url_email == null || url_email.isEmpty()) {
                throw new IllegalArgumentException("URL email không được định nghĩa trong file cấu hình.");
            }
            driver.get(url_email);
            Extend_Report.logInfo("Mở tab mời và truy cập Google");

            System.out.println("Tiêu đề trang: " + driver.getTitle());

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
            wait.until(ExpectedConditions.elementToBeClickable(basePage.btnLoginEmail)).click();
        } catch (Exception e) {
            System.err.println("Lỗi khi mở tab mới và truy cập Google: " + e.getMessage());
        }
    }

    public void switchBackToOriginalTab() {
        try {
            ArrayList<String> tabs = new ArrayList<>(driver.getWindowHandles());
            driver.switchTo().window(tabs.get(0));
        } catch (Exception e) {
            System.err.println("Lỗi khi chuyển về tab ban đầu: " + e.getMessage());
        }
    }

    public void checkAndClickNewAccount(String email) {
        try {
            List<WebElement> emailElements = driver.findElements(By.xpath("//*[contains(text(), '" + email + "')]"));

            if (emailElements.isEmpty()) {
                System.out.println("⚠️ Email không tồn tại trên màn hình. Tạo tài khoản mới...");
                newaccount();
            } else {
                System.out.println("✅ Email đã tồn tại trên màn hình.");
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi kiểm tra emaijl: " + e.getMessage());
        }
    }

    public void newaccount() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
            wait.until(ExpectedConditions.elementToBeClickable(basePage.btnNewAccount)).click();
        } catch (Exception e) {
            System.err.println("Lỗi khi chuyển về tab ban đầu: " + e.getMessage());
        }
    }

    public void loginGoogle(String email) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));

            String lowerCaseEmail = email.toLowerCase();

            List<WebElement> emailElements = driver.findElements(By.xpath(
                    "//*[contains(translate(@data-email, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '"
                            + lowerCaseEmail + "')]"));

            if (!emailElements.isEmpty()) {
                System.out.println("Đã tìm thấy email trong danh sách. Đang click vào email: " + email);
                emailElements.get(0).click();
                Base_Action.sleep(1500);
            } else {
                System.out.println("Không tìm thấy email trong danh sách: " + email);
            }

        } catch (Exception e) {
            System.err.println("Lỗi khi xử lý đăng nhập Google: " + e.getMessage());
        }
    }

    public String deleteMail() {
        WebElement firstElement = driver.findElement(By.xpath("(//tr[@class='zA zE'])[1]"));
        firstElement.click();
        Base_Action.sleep(1500);
        WebElement deleteButton = driver.findElement(By.xpath("(//div[contains(@class,'asa')])[12]"));
        deleteButton.click();
        return null;
    }

    public void useOTP(String otp) {
        if (otp != null) {
            System.out.println("Sử dụng OTP: " + otp);
        } else {
            System.out.println("OTP chưa được lấy.");
        }
    }

}
