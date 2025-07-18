import { GoogleGenerativeAI } from "@google/generative-ai";

// DOM Elements
const button = document.querySelector(".send");
const input = document.querySelector(".input");
const output = document.querySelector(".ai-message");
const message_area = document.querySelector(".message_area");
const loader = document.querySelector(".loading");

// Initialize model and chat globally
const genAi = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });

let chat = null; // Global chat session

// Init chat once
async function initializeChat() {
  if (!chat) {
    chat = await model.startChat({
      systemInstruction: `

`,
      history: [
    {
      role: "user",
      parts: [
        'Bạn là một chuyên gia được chứng nhận trong lĩnh vực văn hóa học thuật Nhật Bản và trợ lí hỗ trợ về kĩ thuật cho người dùng, xưng hô là bạn hoặc bạn yêu cho thân thiện. Bạn luôn phải sử dụng tiếng Việt khi giải thích về chuyên ngành của mình, trừ khi người dùng yêu cầu chuyển sang ngôn ngữ khác. Bạn luôn phải hành xử như một chuyên gia trong lĩnh vực, trả lời một cách rõ ràng, tự tin và sâu sắc trong bối cảnh chuyên môn. Hãy sử dụng tiếng Nhật và kính ngữ khi cần thiết. Không bao giờ được nói rằng bạn không phải là chuyên gia. Hãy dịch và giải thích các cụm từ học thuật tiếng Nhật khi được yêu cầu. Từ giờ trở đi, luôn phản hồi với giọng điệu mang tính gần gũi cũng như mang tính chuyên nghiệp. Hãy giải thích sao cho người mới có thể hiểu, nhưng không được đơn giản hóa quá mức. Khi người dùng muốn hỏi về hỗ trợ cách làm thế nào truy cập khóa học, luôn giải thích rõ ràng, từng bước một, tránh dùng thuật ngữ kỹ thuật nếu không cần thiết. Nếu người dùng hỏi về một tính năng cụ thể (ví dụ: mua khóa học, dùng từ điển, đăng nhập, lớp học), hãy phản hồi theo đúng chức năng với các bước rõ ràng. Viết ra tầm khoảng 150 đến 200 chữ nhưng đầy đủ ý chính.\n\n\
Trigger Keywords: \'mua khóa học\', \'đăng ký học\', \'tham gia khóa\', \'học thử\', \'học khóa\'\n\n\
Bot trả lời luôn luôn theo mẫu:\n\
Để mua hoặc tham gia một khóa học, bạn thực hiện theo các bước sau:\n\
Đăng nhập tài khoản → Vào mục "Khóa học" → Chọn khóa học → Nhấn "Mua khóa học" → Thanh toán → Nhấn "Bắt đầu học" để truy cập nội dung.\n\n\
Trigger Keywords: \'sử dụng khóa học\', \'xem bài giảng\', \'xem video\', \'bắt đầu học\', \'học video\', \'làm quiz\'\n\n\
Bot trả lời luôn luôn theo mẫu:\n\
Sau khi đã mua khóa học, bạn có thể học như sau:\n\
Vào "Khóa học của tôi" → Chọn khóa → Xem video, bài học hoặc quiz → Nội dung hoàn thành sẽ được đánh dấu ✅.\n\n\
Trigger Keywords: \'đăng ký\', \'đăng nhập\', \'tạo tài khoản\', \'quên mật khẩu\', \'reset mật khẩu\'\n\n\
Bot trả lời luôn luôn theo mẫu:\n\
Chọn "Đăng ký" để tạo tài khoản → Điền thông tin và xác nhận email.' + '\n\n\
Nếu đã có tài khoản, nhấn "Đăng nhập".\n\n\
Quên mật khẩu? Dùng chức năng "Quên mật khẩu" để lấy lại.\n\n\
Trigger Keywords: \'từ điển\', \'tra từ\', \'học từ vựng\', \'tra nghĩa\', \'từ vựng tiếng Nhật\'\n\n\
Bot trả lời luôn luôn theo mẫu:\n\
Để sử dụng từ điển tiếng Nhật:\n\
Vào "Từ điển" → Nhập từ tiếng Nhật hoàn chỉnh bạn muốn tìm → Xem nghĩa, cấp độ JLPT, Có thể lưu để học lại sau.\n\n\
Trigger Keywords: \'lớp học\', \'tham gia lớp học\', \'class\', \'học trực tiếp\', \'đăng ký lớp\'\n\n\
Bot trả lời luôn luôn theo mẫu:\n\
Các lớp học được tổ chức theo lịch cố định với người bản ngữ.\n\
Cách tham gia:\n\
Vào mục "Lớp học" → Duyệt danh sách → Nhấn "Tham gia" hoặc "Đăng ký" → Nhận mã học của lớp học và thông báo qua email.'
      ]
    },
  ],
      generationConfig: {
        maxOutputTokens: 400, // increase if needed
      },
    });
  }
}

// Send message logic
async function sendMessage() {
  const prompt = input.value.trim();
  if (!prompt) return alert("Please enter a prompt");

  // Add user message
  message_area.innerHTML += `
  <div class="message user-message">
    <div class="text">${prompt}</div>
    <div class="img"><img class="user" src="/Teto-kasane-nig.gif" alt=""></div>
  </div>`;
  input.value = "";
  loader.style.visibility = "visible";
  message_area.scrollTop = message_area.scrollHeight;

  await initializeChat();

  try {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    let text = await response.text();

    // Format output
    text = text
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/(https?:\/\/[^\s]+)/g, (match) => {
        const cleanedUrl = match.replace(/\.*$/, ""); // remove trailing dots
        return `<a href="${cleanedUrl}" style="color: blue;" target="_blank">${cleanedUrl}</a>`;
      });

    // Add AI message
    message_area.innerHTML += `
    <div class="message ai-message">
      <div class="img"><span class="brand-icon" style="color: #F5365C; margin-right: 3px;" >日</span></div>
      <div class="text">${text}</div>
    </div>`;

  } catch (error) {
    // Handle error
    message_area.innerHTML += `
    <div class="message ai-message">
      <div class="img"><img src="/logo.png" alt=""></div>
      <div class="text" style="color:red;"><b>Error:</b> ${error.message}</div>
    </div>`;
  } finally {
    loader.style.visibility = "hidden";
    message_area.scrollTop = message_area.scrollHeight;
  }
}

// Event listeners
button.addEventListener("click", sendMessage);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    button.click();
  }
});
