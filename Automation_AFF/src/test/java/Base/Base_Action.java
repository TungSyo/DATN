package Base;

import java.io.IOException;
import java.time.Duration;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import Report.Extend_Report;

public class Base_Action {
     protected WebDriver driver;

     public Base_Action(WebDriver driver) {
          this.driver = driver;
     }

     public static void sleep(int milliseconds) {
          try {
               Thread.sleep(milliseconds);
          } catch (InterruptedException e) {
               e.printStackTrace();
          }
     }

     public static void handleVerification(boolean condition, String type, String value) {
          if (condition) {
               Extend_Report.logPass("Kiểm tra " + type + " thành công cho: " + value);
          } else {
               Extend_Report.logFail("Kiểm tra " + type + " thất bại cho: " + value);
          }
     }

     public static void handleTestException(Exception e, String description) throws IOException {
          Extend_Report.logFail("Kiểm tra thất bại: " + description + " với lỗi: " + e.getMessage());
     }

     public void clickElement(WebElement element) {
          WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
          wait.until(ExpectedConditions.elementToBeClickable(element)).click();

     }

     public void clearAndEnterText(WebElement element, String text) {
          element.click(); 
          element.sendKeys(Keys.CONTROL + "a"); 
          element.sendKeys(Keys.BACK_SPACE); 
          element.sendKeys(text); 
      }
      
}
