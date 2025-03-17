package User.ChangePass;

import java.io.IOException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import Base.*;
import Driver.Driver_Manager;
import User.ChangePass.*;
import User.Login.*;
import Utils.ConfigUtil;
import Utils.Excel_Util;
import Utils.ScreenShotUtil;
import Report.Extend_Report;

@SuppressWarnings("unused")

public class ChangePass_Test extends Base_Test {

    @DataProvider(name = "passData")
    public Object[][] getPassData() throws IOException, InvalidFormatException {
        Excel_Util excel = new Excel_Util("src/test/resources/data/User_Data.xlsx", "Change_Pass");
        int rowCount = excel.getRowCount();
        Object[][] data = new Object[rowCount - 1][8];

        for (int i = 1; i < rowCount; i++) {
            data[i - 1][0] = excel.getCellData(i, "Email");
            data[i - 1][1] = excel.getCellData(i, "PassOld");
            data[i - 1][2] = excel.getCellData(i, "PassNew");
            data[i - 1][3] = excel.getCellData(i, "Result");
            data[i - 1][4] = excel.getCellData(i, "Title");
            data[i - 1][5] = excel.getCellData(i, "Link");
            data[i - 1][6] = excel.getCellData(i, "Description");
            data[i - 1][7] = excel.getCellData(i, "TestType");
        }

        return data;
    }

    @Test(dataProvider = "passData", groups = { "Success", "Fail" })
    public void testChangPass(String email, String oldpass, String newpass, String result, String title, String link,
            String description, String testType)
            throws Exception {

        String category = testType.equalsIgnoreCase("Fail") ? "ChangePass_Data_Fail" : "ChangePass_Data_Pass";

        Extend_Report.startTest("Change_Pass Test - " + description, category);

        Base_Action baseAction = new Base_Action(Driver_Manager.getDriver());
        User_Login_Action loginActions = new User_Login_Action(Driver_Manager.getDriver());
        ChangePass_Action changepassActions = new ChangePass_Action(Driver_Manager.getDriver());

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
                        String password = ConfigUtil.getProperty("password_admin");
                        loginActions.login(email, password);
                        baseAction.sleep(1500);
                        changepassActions.changePass(oldpass, newpass);
                        baseAction.sleep(1500);
                        break;

                    case "verifynotion":
                        baseAction.handleVerification(changepassActions.verifyNotion(result), "thông báo", result);
                        break;

                    case "verifytitle":
                        baseAction.handleVerification(changepassActions.verifyTitle(title), "tiêu đề", title);
                        break;

                    case "verifylink":
                        baseAction.handleVerification(changepassActions.verifyLink(link), "link", link);
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