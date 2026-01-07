import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

const CHARTING_LINK = "https://chartink.com/screener/";
const CHARTING_URL = "https://chartink.com/screener/process";

// Create axios instance with cookie support
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function getDataFromChartink(payload) {
  try {
    // Get CSRF token and establish session
    const response = await client.get(CHARTING_LINK, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const html = response.data;
    const csrf = html.match(/name="csrf-token" content="([^"]+)"/)[1];
    // console.log("csrf", csrf);

    // Make POST request with CSRF token
    const result = await client.post(
      CHARTING_URL,
      new URLSearchParams({
        scan_clause: payload,
        _token: csrf,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "en-US,en;q=0.5",
          "X-Requested-With": "XMLHttpRequest",
          Referer: CHARTING_LINK,
        },
      }
    );

    console.log("result status:", result.status);
    return result.data.data;
  } catch (error) {
    if (error.response) {
      console.log("Error status:", error.response.status);
      console.log("Error data:", error.response.data);
    }
    throw error;
  }
}

export { getDataFromChartink };
