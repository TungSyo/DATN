# Sử dụng Ubuntu làm base image
FROM ubuntu:22.04

# Chạy với quyền root
USER root

# Cập nhật hệ thống và cài đặt các công cụ cần thiết
RUN apt-get update && apt-get install -y \
    openjdk-11-jre-headless \
    xvfb \
    unzip \
    wget \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Thiết lập biến môi trường
ENV DOCKER_ENV=true

# Tạo thư mục cho Google Chrome
RUN mkdir -p /opt/google/chrome/

# Sao chép Chrome Portable và Chromedriver vào container
COPY chrome-files/GoogleChromePortable.zip /opt/google/
COPY chrome-files/chromedriver.exe /usr/local/bin/chromedriver

# Giải nén Google Chrome
RUN unzip -q /opt/google/GoogleChromePortable.zip -d /opt/google/chrome/

# Tạo symbolic link cho Chrome
RUN CHROME_PATH=$(find /opt/google/chrome/ -type f -name "chrome" | head -n 1) \
    && if [ -z "$CHROME_PATH" ]; then CHROME_PATH=$(find /opt/google/chrome/ -type f -name "chrome.exe" | head -n 1); fi \
    && if [ -z "$CHROME_PATH" ]; then echo "KHÔNG TÌM THẤY TỆP THỰC THI CHROME!" && exit 1; \
    else echo "Đã tìm thấy Chrome tại: $CHROME_PATH" && chmod +x "$CHROME_PATH" && ln -sf "$CHROME_PATH" /usr/bin/google-chrome; fi

# Xóa file ZIP để tiết kiệm dung lượng
RUN rm -rf /opt/google/GoogleChromePortable.zip

# Kiểm tra Chrome đã được cài đặt đúng chưa
RUN if [ -f /usr/bin/google-chrome ]; then echo "Cài đặt Chrome thành công!"; ls -l /usr/bin/google-chrome; else echo "Cài đặt Chrome thất bại!" && exit 1; fi

# Thêm user không phải root
RUN useradd -u 1200 -m appuser || echo "Người dùng đã tồn tại"
USER 1200

# Cài đặt Selenium Node
COPY chrome-files/selenium-server-4.29.0.jar /opt/selenium-server.jar


# Thiết lập biến môi trường cho Selenium Node
ENV SE_EVENT_BUS_HOST=selenium-hub
ENV SE_EVENT_BUS_PUBLISH_PORT=4442
ENV SE_EVENT_BUS_SUBSCRIBE_PORT=4443

# Làm việc trong thư mục /app
WORKDIR /app

# Khởi chạy Selenium Node
CMD ["java", "-jar", "/opt/selenium-server.jar", "node"]