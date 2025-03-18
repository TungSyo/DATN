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

import Utils.ConfigUtil;
import io.github.bonigarcia.wdm.WebDriverManager;

@SuppressWarnings("unused")
public class Driver_Manager {
    private static final ThreadLocal<WebDriver> threadLocalDriver = new ThreadLocal<>();
    private static final ThreadLocal<WebDriverWait> threadLocalWait = new ThreadLocal<>();

    @SuppressWarnings("deprecation")
    public static void initDriver(Browser_Type browser) throws MalformedURLException {
        WebDriver driver;
        Environment environment = getEnvironment();
    
        String gridURL = "http://localhost:4444/wd/hub"; // Docker Grid mặc định
        String chromeBinaryPath;
    
        switch (environment) {
            case GITHUB: // Chưa làm được
                chromeBinaryPath = System.getenv("GITHUB_WORKSPACE") + "/Chrome/App/Chrome-bin/chrome.exe";
                System.setProperty("webdriver.chrome.driver",
                        System.getenv("GITHUB_WORKSPACE") + "/Chrome/chromedriver.exe");
                break;
    
            case DOCKER:
                chromeBinaryPath = "/usr/bin/google-chrome-stable";
                gridURL = "http://host.docker.internal:4444/wd/hub"; // Chạy trên Docker Desktop for Linux
                break;

            case LINUX:
                chromeBinaryPath = "/usr/bin/google-chrome-stable";
                WebDriverManager.chromedriver().driverVersion("131.0.6778.264").setup();
                break;
                
            default: 
                chromeBinaryPath = "D:\\Tài xuống\\GoogleChromePortable\\App\\Chrome-bin\\chrome.exe";
                WebDriverManager.chromedriver().driverVersion("131.0.6778.86").setup();
                    
                break;
        }
    
        switch (browser) {
            case CHROME:
                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.setBinary(chromeBinaryPath);
                chromeOptions.addArguments("--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage");
    
                if (environment == Environment.GITHUB) {
                    chromeOptions.addArguments("--headless=new");
                }
    
                driver = (environment == Environment.DOCKER) ? 
                    new RemoteWebDriver(new URL(gridURL), chromeOptions) : 
                    new ChromeDriver(chromeOptions);
                break;
    
            case EDGE:
                WebDriverManager.edgedriver().setup();
                EdgeOptions edgeOptions = new EdgeOptions();
                edgeOptions.addArguments("--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage");
                driver = new EdgeDriver(edgeOptions);
                break;
            
            case FIREFOX:
                WebDriverManager.edgedriver().setup();
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                firefoxOptions.addArguments("--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage");
                driver = new FirefoxDriver(firefoxOptions);
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

    private static Environment getEnvironment() {
        String env = ConfigUtil.getProperty("TEST_ENV");
    
        if ("GITHUB".equalsIgnoreCase(env)) {
            return Environment.GITHUB;
        } else if ("DOCKER".equalsIgnoreCase(env)) {
            return Environment.DOCKER;
        } else {
            return Environment.LOCAL; 
        }
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
