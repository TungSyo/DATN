package User.Information;

import java.io.IOException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import Base.Base_Action;
import Base.Base_Test;
import Driver.Driver_Manager;
import User.Information.*;
import User.Login.*;
import Utils.ConfigUtil;
import Utils.Excel_Util;
import Utils.ScreenShotUtil;
import Report.Extend_Report;

@SuppressWarnings("unused")

public class Information_Test extends Base_Test {

    @DataProvider(name = "informationData")
    public Object[][] getInformationData() throws IOException, InvalidFormatException {
        Excel_Util excel = new Excel_Util("src/test/resources/data/User_Data.xlsx", "Information");
        int rowCount = excel.getRowCount();
        Object[][] data = new Object[rowCount - 1][15];

        for (int i = 1; i < rowCount; i++) {
            data[i - 1][0] = excel.getCellData(i, "Name");
            data[i - 1][1] = excel.getCellData(i, "CMND");
            data[i - 1][2] = excel.getCellData(i, "City");
            data[i - 1][3] = excel.getCellData(i, "District");
            data[i - 1][4] = excel.getCellData(i, "Ward");
            data[i - 1][5] = excel.getCellData(i, "Location");
            data[i - 1][6] = excel.getCellData(i, "Mst");
            data[i - 1][7] = excel.getCellData(i, "Date");
            data[i - 1][8] = excel.getCellData(i, "Bank");
            data[i - 1][9] = excel.getCellData(i, "Stk");
            data[i - 1][10] = excel.getCellData(i, "Result");
            data[i - 1][11] = excel.getCellData(i, "Title");
            data[i - 1][12] = excel.getCellData(i, "Link");
            data[i - 1][13] = excel.getCellData(i, "Description");
            data[i - 1][14] = excel.getCellData(i, "TestType");
        }

        return data;
    }

    @Test(dataProvider = "informationData", groups = { "Success", "Fail" })
    public void testLogin(String name, String cmnd, String city, String district, String ward, String location,
            String mst, String date, String bank, String stk, String result, String title, String link,
            String description,
            String testType)
            throws Exception {

        String category = testType.equalsIgnoreCase("Fail") ? "Information_Data_Fail" : "Information_Data_Pass";

        Extend_Report.startTest("Information Test - " + description, category);

        Base_Action baseAction = new Base_Action(Driver_Manager.getDriver());
        Information_Action inforActions = new Information_Action(Driver_Manager.getDriver());
        User_Login_Action loginActions = new User_Login_Action(Driver_Manager.getDriver());

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
                        Extend_Report.logInfo("Thực hiện test case: " + description);
                        String username = ConfigUtil.getProperty("username_admin");
                        String password = ConfigUtil.getProperty("password_admin");
                        loginActions.login(username, password);
                        baseAction.sleep(1500);
                        inforActions.updateInfor(name, cmnd, city, district, ward, location, mst, date, bank, stk);
                        baseAction.sleep(1500);
                        break;

                    case "verifynotion":
                        baseAction.handleVerification(inforActions.verifyNotion(result), "thông báo", result);
                        break;

                    case "verifytitle":
                        baseAction.handleVerification(inforActions.verifyTitle(title), "tiêu đề", title);
                        break;

                    case "verifylink":
                        baseAction.handleVerification(inforActions.verifyLink(link), "link", link);
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