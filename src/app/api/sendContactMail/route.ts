// sendContactMail
import { NextRequest } from "next/server";
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const mainText = requestBody.mainText;
    const optionValue = requestBody.optionValue;
    const res = await sendContactMail(mainText, optionValue);
    // console.log(res);
    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

const sendContactMail = async (mainText: string, optionValue: string) => {
  try {
    // console.log(mainText);
    const contact_webhook_url: string = process.env.CONTACT_WEBHOOK_URL || "";
    const response = await axios.post(contact_webhook_url, { mainText: mainText, optionValue: optionValue });
    // console.log(response);
    const status = response.status;
    if (status === 200) {
      return { msg: "送信に成功しました。" };
    } else {
      return { msg: "サーバーからのエラー: " + response.statusText };
    }
  } catch (error: any) {
    let errorMsg = "送信に失敗しました。";

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // サーバーからのエラーレスポンスがある場合
        if (error.response.status === 401) {
          errorMsg = "認証エラーが発生しました。";
        } else {
          errorMsg = "サーバーエラーが発生しました。";
        }
      } else {
        // タイムアウトなどのネットワークエラーがある場合
        errorMsg = "ネットワークエラーが発生しました。";
      }
    }

    return { msg: errorMsg };
  }
}
