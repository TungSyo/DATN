https://github.com/TungSyo/Automation_AFF.git
# **🔹 1. Đảm bảo Selenium Hub đang chạy**
Trước khi thêm node, hãy kiểm tra Hub đã hoạt động chưa:

docker ps
// Container độc lập
docker run -d -p 4444:4444 --name chrome-v131 selenium/standalone-chrome:131.0.6778.264-20250222

-- Tạo mạng Grid
docker network create selenium-grid
```

# Xây dựng Docker image
docker build -t my-angular-app .

# Chạy container từ image
docker run -p 4200:4200 my-angular-app

# **🔹3. Cấu hình GitHub Actions - Phải set up thư mục nhận chrome đúng với thư mục Driver của CODE**

# **🔹4. Upload report lên artifact thay vì in log**
```yaml
- name: Upload Test Report
  uses: actions/upload-artifact@v3
  with:
    name: Test-Report
    path: test-output/ExtentReport.html

Docker + Selenium Grid + Brow
jobs:
  local-test:
    runs-on: ubuntu-latest
    steps:
      - name: Run tests on Selenium Grid (Docker)
        run: mvn test -Dexecution=local

  browserstack-test:
    needs: local-test
    runs-on: ubuntu-latest
    steps:
      - name: Run tests on BrowserStack
        run: mvn test -Dexecution=browserstack


public WebDriver getDriver(String execution) {
    if (execution.equals("local")) {
        // Dùng Selenium Grid (Docker)
        return new RemoteWebDriver(new URL("http://localhost:4444/wd/hub"), new ChromeOptions());
    } else {
        // Dùng BrowserStack
        DesiredCapabilities caps = new DesiredCapabilities();
        caps.setCapability("browser", "Chrome");
        caps.setCapability("browser_version", "latest");
        caps.setCapability("os", "Windows");
        caps.setCapability("os_version", "10");
        caps.setCapability("browserstack.user", "YOUR_USERNAME");
        caps.setCapability("browserstack.key", "YOUR_ACCESS_KEY");
        return new RemoteWebDriver(new URL("https://hub.browserstack.com/wd/hub"), caps);
    }
}

Cách sử dụng self-hosted runner:
Chạy self-hosted runner:

Trên máy của bạn, mở PowerShell hoặc Command Prompt với quyền Administrator.
Điều hướng vào thư mục runner (C:\actions-runner hoặc thư mục bạn đã cấu hình).
Chạy lệnh:
powershell
Sao chép
Chỉnh sửa
./run.cmd
Nếu đã cài đặt runner dưới dạng Windows Service, bạn có thể khởi động bằng:
powershell
Sao chép
Chỉnh sửa
Start-Service actions.runner.TungSyo-BE_AFF
Đẩy file YAML lên GitHub:

Lưu lại file YAML đã chỉnh sửa.
Commit và push lên repository.
Kiểm tra workflow:

Vào GitHub > Repository của bạn > Actions để xem trạng thái workflow chạy trên self-hosted runner.