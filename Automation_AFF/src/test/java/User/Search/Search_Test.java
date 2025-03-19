package User.Search;

import java.io.IOException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.fasterxml.jackson.databind.JsonSerializable.Base;

import Base.Base_Action;
import Base.Base_Test;
import Driver.Driver_Manager;
import User.Login.User_Login_Action;
import Utils.ConfigUtil;
import Utils.Excel_Util;
import Utils.ScreenShotUtil;
import Report.Extend_Report;

@SuppressWarnings("unused")

public class Search_Test extends Base_Test {

    @DataProvider(name = "searchData")
    public Object[][] getSearchData() throws IOException, InvalidFormatException {
        Excel_Util excel = new Excel_Util("src/test/resources/data/User_Data.xlsx", "Search");
        int rowCount = excel.getRowCount();
        Object[][] data = new Object[rowCount - 1][7];

        for (int i = 1; i < rowCount; i++) {
            data[i - 1][0] = excel.getCellData(i, "Search");
            data[i - 1][1] = excel.getCellData(i, "Result");
            data[i - 1][3] = excel.getCellData(i, "Title");
            data[i - 1][4] = excel.getCellData(i, "Link");
            data[i - 1][5] = excel.getCellData(i, "Description");
            data[i - 1][6] = excel.getCellData(i, "TestType");
        }

        return data;
    }

    @Test(dataProvider = "searchData", groups = { "Success", "Fail" })
    public void testSearch(String search, String result, String title, String link, String description,
            String testType)
            throws Exception {

        String category = testType.equalsIgnoreCase("Fail") ? "Search_Data_Fail" : "Search_Data_Pass";
        Extend_Report.startTest("Search Test - " + description, category);
        Base_Action baseAction = new Base_Action(Driver_Manager.getDriver());
        Search_Action searchActions = new Search_Action(Driver_Manager.getDriver());

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
                        url_user = baseAction.convertLocalhostLink(url_user);
                        Driver_Manager.getDriver().get(url_user);
                        Extend_Report.logInfo("Điều hướng đến " + url_user);
                        break;

                    case "action":
                        searchActions.searchProduct(search);
                        Extend_Report.logInfo("Thực hiện test case: " + description);
                        break;

                    case "verifynotion":
                        baseAction.handleVerification(searchActions.verifyNotion(result), "thông báo", result);
                        break;

                    case "verifytitle":
                        baseAction.handleVerification(searchActions.verifyTitle(title), "tiêu đề", title);
                        break;

                    case "verifylink":
                        baseAction.handleVerification(searchActions.verifyLink(link), "link", link);
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