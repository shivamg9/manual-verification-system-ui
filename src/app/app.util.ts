import { DatePipe, registerLocaleData } from "@angular/common";
export default class Utils {
    static getCurrentDate() {
      const now = new Date();
      const pipe = new DatePipe("en-US");
      let formattedDate = pipe.transform(now, "yyyy-MM-ddTHH:mm:ss.SSS", "UTC");
      formattedDate = formattedDate + "Z";
      return formattedDate;
    }
}