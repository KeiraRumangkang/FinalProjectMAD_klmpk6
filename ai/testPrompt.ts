import * as dotenv from "dotenv";
// Memaksa dotenv membaca file .env.local
dotenv.config({ path: "../.env.local" }); 

import { SUMMARY_PROMPT } from "./prompts/summaryPrompt";

// Mengambil API Key dari .env.local demi keamanan
const API_KEY = process.env.GROQ_API_KEY;

// Pengecekan keamanan: hentikan program jika API_KEY tidak ditemukan
if (!API_KEY) {
  console.error("❌ ERROR: GROQ_API_KEY tidak ditemukan di file .env.local!");
  console.error("Pastikan kamu sudah membuat file .env.local dan memasukkan key-nya.");
  process.exit(1);
}

async function testSummary() {
  console.log("⏳ Mengirim log percakapan ke AI untuk dirangkum...\n");

  // Ini adalah simulasi log percakapan antara user dan Socratic Tutor
  const dummyConversation = `
    User: Saya pusing mencari nilai x dari 3x - 3 = 6.
    Tutor: Mari kita pecahkan pelan-pelan. Apa yang bisa kita lakukan untuk menghilangkan angka -3 di sebelah kiri?
    User: Ditambah 3?
    Tutor: Tepat sekali! Kalau sebelah kiri ditambah 3, sebelah kanan juga harus ditambah 3. Jadi seperti apa persamaannya sekarang?
    User: Oh, jadi 3x = 9.
    Tutor: Bagus! Sekarang, bagaimana cara agar tersisa 'x' saja?
    User: Dibagi 3 ya?
    Tutor: Betul! Jadi berapa nilai x-nya?
    User: x = 3! Wah gampang ternyata, terima kasih!
  `;

  try {
    const response = await fetch(
      `https://api.groq.com/openai/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: SUMMARY_PROMPT
            },
            {
              role: "user",
              content: `Buatkan ringkasannya berdasarkan percakapan berikut:\n\n${dummyConversation}`
            }
          ],
          temperature: 0.5 // Dibuat 0.5 agar AI lebih fokus dan tidak terlalu berhalusinasi saat merangkum
        }),
      }
    );

    const data: any = await response.json();
    
    if (data.error) {
        console.error("❌ API ERROR:", data.error.message);
        return;
    }

    const reply = data?.choices?.[0]?.message?.content;
    
    console.log("=====================================");
    console.log("✨ HASIL SUMMARY DARI AI:");
    console.log("=====================================\n");
    console.log(reply);
    console.log("\n=====================================");

  } catch (err) {
    console.error("❌ ERROR SYSTEM:", err);
  }
}

// Jalankan fungsi
testSummary();