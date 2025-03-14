# Sử dụng base image phù hợp (ví dụ: Ubuntu)
FROM ubuntu:22.04

# Chuyển sang user root để thực hiện cài đặt
USER root

# Cài đặt các dependencies cần thiết
RUN apt-get update && \
    apt-get install -y wget unzip ca-certificates file && \
    rm -rf /var/lib/apt/lists/*

# Tạo thư mục chứa Chrome & ChromeDriver
RUN mkdir -p /opt/google/chrome/

# Copy Chrome Portable (ZIP) & ChromeDriver vào container
COPY Driver/GoogleChromePortable.zip /opt/google/
COPY Driver/chromedriver.exe /usr/local/bin/chromedriver

# Xem nội dung thư mục để xác nhận file tồn tại
RUN echo "Danh sách file trong /opt/google/:" && ls -la /opt/google/

# Giải nén Chrome Portable 
RUN unzip -q /opt/google/GoogleChromePortable.zip -d /opt/google/chrome/

# Kiểm tra cấn trúc thư mục sau khi giải nén
RUN echo "Nội dung trong thư mục /opt/google/chrome/:" && \
    ls -la /opt/google/chrome/ && \
    echo "Đang tìm kiếm tệp thực thi Chrome..." && \
    find /opt/google/chrome/ -type f -name "*chrome*" | grep -v "html"

# Tạo biến môi trường chứa đường dẫn đến Chrome
RUN CHROME_PATH=$(find /opt/google/chrome/ -type f -name "chrome" | head -n 1) && \
    if [ -z "$CHROME_PATH" ]; then \
        CHROME_PATH=$(find /opt/google/chrome/ -type f -name "chrome.exe" | head -n 1); \
    fi && \
    if [ -z "$CHROME_PATH" ]; then \
        echo "KHÔNG TÌM THẤY TỆP THỰC THI CHROME!" && \
        exit 1; \
    else \
        echo "Đã tìm thấy Chrome tại: $CHROME_PATH" && \
        chmod +x "$CHROME_PATH" && \
        ln -sf "$CHROME_PATH" /usr/bin/google-chrome && \
        echo "Đã tạo liên kết symbolic thành công"; \
    fi

# Xóa file zip để tiết kiệm không gian
RUN rm -rf /opt/google/GoogleChromePortable.zip

# Kiểm tra cài đặt Chrome
RUN if [ -f /usr/bin/google-chrome ]; then \
        echo "Cài đặt Chrome thành công!"; \
        ls -l /usr/bin/google-chrome; \
    else \
        echo "Cài đặt Chrome thất bại!"; \
        echo "Đang hiển thị thư mục Chrome để gỡ lỗi:"; \
        find /opt/google/chrome/ -name "*chrome*" -type f | grep -v "html"; \
        exit 1; \
    fi

# Tạo người dùng nếu chưa tồn tại
RUN useradd -u 1200 -m appuser || echo "Người dùng đã tồn tại"

# Chuyển sang user 1200
USER 1200

# Đặt working directory (tùy chọn)
WORKDIR /app

# Kết thúc
CMD tail -f /dev/null