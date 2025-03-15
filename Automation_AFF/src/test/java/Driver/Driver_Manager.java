package Driver;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.chromium.ChromiumOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;

@SuppressWarnings("unused")
public class Driver_Manager {
    private static final ThreadLocal<WebDriver> threadLocalDriver = new ThreadLocal<>();
    private static final ThreadLocal<WebDriverWait> threadLocalWait = new ThreadLocal<>();

    public static void initDriver(Browser_Type browser) throws MalformedURLException {
        WebDriver driver;
        boolean isCI = System.getenv("GITHUB_WORKSPACE") != null;
        boolean isDocker = "true".equalsIgnoreCase(System.getenv("DOCKER_ENV"));

        switch (browser) {
            case CHROME:
                String chromeBinaryPath;
                String gridURL = "http://host.docker.internal:4444/wd/hub"; 

                if (isCI) {
                    chromeBinaryPath = System.getenv("GITHUB_WORKSPACE") + "/Chrome/App/Chrome-bin/chrome.exe";
                    System.setProperty("webdriver.chrome.driver",
                            System.getenv("GITHUB_WORKSPACE") + "/Chrome/chromedriver.exe");
                } else {
                    chromeBinaryPath = "D:\\Tài xuống\\GoogleChromePortable\\App\\Chrome-bin\\chrome.exe";
                    WebDriverManager.chromedriver().driverVersion("131.0.6778.86").setup();
                }

                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.setBinary(chromeBinaryPath);
                chromeOptions.addArguments("--disable-gpu");
                chromeOptions.addArguments("--no-sandbox");
                chromeOptions.addArguments("--disable-dev-shm-usage");

                if (isCI) {
                    chromeOptions.addArguments("--headless=new");
                }
                driver = new ChromeDriver(chromeOptions);
                // driver = new RemoteWebDriver(new URL(gridURL), chromeOptions);
                break;

            case EDGE:
                WebDriverManager.edgedriver().setup();
                EdgeOptions edgeOptions = new EdgeOptions();
                edgeOptions.addArguments("--headless=new");
                edgeOptions.addArguments("--disable-gpu");
                edgeOptions.addArguments("--no-sandbox");
                edgeOptions.addArguments("--disable-dev-shm-usage");
                driver = new EdgeDriver(edgeOptions);
                break;

            default:
                throw new IllegalArgumentException("Trình duyệt không được hỗ trợ: " + browser);
        }

        driver.manage().window().maximize();
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(20));
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));

        threadLocalDriver.set(driver);
        threadLocalWait.set(new WebDriverWait(driver, Duration.ofSeconds(10)));
    }

    public static WebDriver getDriver() {
        WebDriver driver = threadLocalDriver.get();
        if (driver == null) {
            throw new IllegalStateException("WebDriver chưa được khởi tạo. Gọi initDriver() trước.");
        }
        return driver;
    }

    public static WebDriverWait getWait() {
        WebDriverWait wait = threadLocalWait.get();
        if (wait == null) {
            throw new IllegalStateException("WebDriverWait chưa được khởi tạo. Gọi initDriver() trước.");
        }
        return wait;
    }

    public static void quitDriver() {
        WebDriver driverInstance = threadLocalDriver.get();
        if (driverInstance != null) {
            driverInstance.quit();
            threadLocalDriver.remove();
            System.out.println("✅ Đã đóng trình duyệt.");
        } else {
            System.out.println("🚫 Trình duyệt không tồn tại hoặc đã được đóng.");
        }
    }

    public static void quitAllDrivers() {
        WebDriver driver = threadLocalDriver.get();
        if (driver != null) {
            driver.quit();
            driver = null;
            System.out.println("✅ Đã đóng tất cả trình duyệt.");
        }
    }

}
