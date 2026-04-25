export const SUMMARY_PROMPT = `
Buatkan ringkasan sesi belajar ini dalam teks yang rapi, ringkas, dan mudah dibaca oleh siswa.

Gunakan struktur berikut:
🎯 **Masalah:** [Sebutkan soal atau masalah yang dibahas]
💡 **Konsep Utama:** [Sebutkan konsep atau metode yang dipelajari]
🧠 **Langkah Penyelesaian:** - [Langkah 1]
- [Langkah 2]
- [Dan seterusnya...]
✅ **Hasil Akhir:** [Jawaban akhir]

Aturan:
- Gunakan bahasa yang ramah dan memotivasi.
- JANGAN gunakan format JSON.
- Langsung berikan ringkasan tanpa kalimat pembuka/penutup tambahan.
`;