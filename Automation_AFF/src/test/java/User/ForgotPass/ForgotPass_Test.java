package User.ForgotPass;

import java.io.IOException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import Base.*;
import Driver.Driver_Manager;
import User.ForgotPass.*;
import User.Login.*;
import Utils.ConfigUtil;
import Utils.Excel_Util;
import Utils.ScreenShotUtil;
import Report.Extend_Report;

@SuppressWarnings("unused")

public class ForgotPass_Test extends Base_Test {

    @DataProvider(name = "forgotpassData")
    public Object[][] getPassData() throws IOException, InvalidFormatException {
        Excel_Util excel = new Excel_Util("src/test/resources/data/User_Data.xlsx", "ForgotPass");
        int rowCount = excel.getRowCount();
        Object[][] data = new Object[rowCount - 1][9];

        for (int i = 1; i < rowCount; i++) {
            data[i - 1][0] = excel.getCellData(i, "Email");
            data[i - 1][1] = excel.getCellData(i, "NewPass");
            data[i - 1][2] = excel.getCellData(i, "ComfirmPass");
            data[i - 1][3] = excel.getCellData(i, "Result");
            data[i - 1][4] = excel.getCellData(i, "Title");
            data[i - 1][5] = excel.getCellData(i, "Link");
            data[i - 1][6] = excel.getCellData(i, "Description");
            data[i - 1][7] = excel.getCellData(i, "TestType");
            data[i - 1][8] = excel.getCellData(i, "Pop3");
        }

        return data;
    }

    @Test(dataProvider = "forgotpassData", groups = { "Success", "Fail" })
    public void testForgotPass(String email, String newPass, String comfirmPass, String result, String title,
            String link,
            String description, String testType, String pop3)
            throws Exception {

        String category = testType.equalsIgnoreCase("Fail") ? "ForgotPass_Data_Fail" : "ForgotPass_Data_Pass";

        Extend_Report.startTest("Forgot_Pass Test - " + description, category);

        Base_Action baseAction = new Base_Action(Driver_Manager.getDriver());
        ForgotPass_Action forgotpassActions = new ForgotPass_Action(Driver_Manager.getDriver());

        try {
            Excel_Util excelSteps = new Excel_Util("src/test/resources/step/Step.xlsx", "Step");

            int rowCount = excelSteps.getRowCount();

            for (int i = 1; i < rowCount; i++) {
                String action = excelSteps.getCellData(i, "Action Keyword");

                switch (action.toLowerCase()) {
                    case "open":
                        Extend_Report.logInfo("Mở trình duyệt...");
                        break;

                    case "navigate":
                        String url_user = ConfigUtil.getProperty("url_user");
                        Driver_Manager.getDriver().get(url_user);
                        Extend_Report.logInfo("Điều hướng đến " + url_user);
                        break;

                    case "action":
                        forgotpassActions.forgotPass(email, newPass, comfirmPass, pop3, description);
                        break;

                    case "verifynotion":
                        baseAction.handleVerification(forgotpassActions.verifyNotion(result), "thông báo", result);
                        break;

                    case "verifytitle":
                        baseAction.handleVerification(forgotpassActions.verifyTitle(title), "tiêu đề", title);
                        break;

                    case "verifylink":
                        baseAction.handleVerification(forgotpassActions.verifyLink(link), "link", link);
                        break;
                    case "close":
                        Extend_Report.logInfo("Đóng trình duyệt...");
                        break;
                    default:
                        throw new IllegalArgumentException("Hành động chưa xác định: " + action);
                }
            }
        } catch (Exception e) {
            baseAction.handleTestException(e, description);
            throw e;
        }
    }
}