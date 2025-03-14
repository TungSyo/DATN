package Utils;

import javax.mail.*;
import javax.mail.internet.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.Properties;

public class Email_Reader {

    public static String readLatestEmail(String host, String username, String password) throws Exception {
        Properties properties = new Properties();
        properties.put("mail.pop3.host", host); // Đảm bảo host đúng
        properties.put("mail.pop3.port", "995"); // Port của POP3
        properties.put("mail.pop3.ssl.enable", "true"); // Đảm bảo SSL được bật

        Session session = Session.getInstance(properties);
        Store store = null;
        Folder inbox = null;

        try {
            store = session.getStore("pop3s");
            store.connect(host, username, password);

            inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_ONLY);

            Message[] messages = inbox.getMessages();
            if (messages.length == 0) {
                System.out.println("⏳ Không có email mới.");
                return null;
            }

            MimeMessage latestMessage = (MimeMessage) messages[messages.length - 1];
            System.out.println("📧 Subject: " + latestMessage.getSubject());

            String emailContent = getTextFromMessage(latestMessage);
            System.out.println("📜 Nội dung email: " + emailContent);

            return extractOtpFromEmail(emailContent);

        } catch (AuthenticationFailedException e) {
            System.err.println("❌ Lỗi xác thực tài khoản: " + e.getMessage());
            throw e;
        } catch (MessagingException e) {
            System.err.println("❌ Lỗi kết nối POP3: " + e.getMessage());
            throw e;
        } finally {
            if (inbox != null && inbox.isOpen()) inbox.close(false);
            if (store != null) store.close();
        }
    }

    private static String getTextFromMessage(Message message) throws Exception {
        if (message.isMimeType("text/plain")) {
            return message.getContent().toString();  
        }
        else if (message.isMimeType("multipart/*")) {
            return getTextFromMimeMultipart((MimeMultipart) message.getContent());  
        }
        else if (message.isMimeType("text/html")) {
            return (String) message.getContent();
        }
        return "";
    }
    
    private static String getTextFromMimeMultipart(MimeMultipart mimeMultipart) throws Exception {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < mimeMultipart.getCount(); i++) {
            BodyPart bodyPart = mimeMultipart.getBodyPart(i);
            
            if (bodyPart.isMimeType("text/plain")) {
                result.append(bodyPart.getContent().toString());
            } 
            else if (bodyPart.isMimeType("text/html")) {
                result.append((String) bodyPart.getContent());
            } 
            else if (bodyPart.getContent() instanceof MimeMultipart) {
                result.append(getTextFromMimeMultipart((MimeMultipart) bodyPart.getContent()));
            }
        }
        return result.toString();
    }
    

    public static String extractOtpFromEmail(String emailContent) {
        if (emailContent != null) {
            String otpFromText = extractOtpFromPlainText(emailContent);
            if (otpFromText != null && !otpFromText.isEmpty()) {
                return otpFromText;
            }
            String otpFromHtml = extractOtpFromHtml(emailContent);
            if (otpFromHtml != null && !otpFromHtml.isEmpty()) {
                return otpFromHtml;
            }
        }
        System.out.println("⏳ Không tìm thấy OTP.");
        return null;
    }
    private static String extractOtpFromPlainText(String emailContent) {
        if (emailContent.contains("AFF-HONIVY is")) {
            int startIndex = emailContent.indexOf("is") + 2;
            String otpPart = emailContent.substring(startIndex).trim();
            String otp = otpPart.replaceAll("[^0-9]", "");
            if (!otp.isEmpty()) {
                return otp;
            }
        }
        return null;
    }

    private static String extractOtpFromHtml(String emailContent) {
        Document doc = Jsoup.parse(emailContent);
        Elements otpElements = doc.select("span, div"); 

        for (Element otpElement : otpElements) {
            String text = otpElement.text();
            if (text.contains("AFF-HONIVY is")) {
                int startIndex = text.indexOf("is") + 2;
                String otpPart = text.substring(startIndex).trim();
                String otp = otpPart.replaceAll("[^0-9]", "");
                if (!otp.isEmpty()) {
                    return otp;
                }
            }
        }
        return null;
    }
}
