import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "id" | "en";

const dictionaries = {
  id: {
    nav: {
      home: "Beranda",
      watch: "Nonton",
      generations: "Generasi",
      admin: "Admin",
      readme: "Readme",
      join: "Join",
    },
    common: {
      back: "Kembali",
      members: "member",
      comingSoon: "Coming soon",
      joinNow: "Join Sekarang",
      explore: "Jelajahi",
    },
    home: {
      badge: "Selalu open member",
      heroDesc:
        "Marga editor & kreator anime. Tempatnya berkarya, berkolaborasi, dan bertumbuh bareng.",
      statsTitle: "Statistik Marga",
      statsDesc: "Jumlah member tiap generasi Five Fail Family.",
      gens: [
        {
          title: "Five Fail Family Gen 1",
          tag: "Gen para sepuh",
          desc: "Generasi pertama yang membangun marga.",
        },
        {
          title: "Five Fail Family Gen 2",
          tag: "Gen anomali",
          desc: "Generasi kedua untuk calon member creator anime, manhwa, & manhua.",
        },
        {
          title: "Five Fail Family Gen 3",
          tag: "Gen newbie",
          desc: "Open Member.",
        },
      ],
      footer: "Created By Kyu",
    },
    tiktok: {
      hashtagTitle: "Hashtag Five Fail",
      hashtagDesc: "Data live via TikTok",
      views: "Jumlah Penonton",
      videos: "Jumlah Video",
      notFound: "Tidak ditemukan",
      loadFail: "Gagal memuat",
      rateLimit: "Gagal memuat (rate limit)",
      searchTitle: "Cari Akun TikTok",
      searchDesc: "Cek profil akun TikTok lewat username",
      searchPlaceholder: "username tiktok",
      searchBtn: "Cari",
      accountNotFound: "Akun tidak ditemukan.",
      searchFail: "Gagal memuat. Coba lagi.",
      followers: "Pengikut",
      following: "Mengikuti",
      likes: "Suka",
      videosLabel: "Video",
      member: "MEMBER 5F",
      notMember: "BUKAN MEMBER",
      memberDesc: "Terdeteksi sebagai anggota Five Fail Family",
      notMemberDesc: "Belum terdeteksi sebagai anggota Five Fail Family",
    },
    join: {
      badge: "Open recruitment",
      title: "Gabung Five Fail Family",
      desc: "Silahkan seleksi terlebih dahulu, lalu ngegas bareng di marga.",
      pathsTitle: "Jalur Masuk",
      pathsDesc: "Baca deskripsi terlebih dahulu sebelum masuk grup.",
      path1: {
        label: "Seleksi",
        badge: "Wajib Seleksi",
        title: "Jalur Seleksi",
        audience: "Khusus creator preset, AMV, L2D, dan edit video (Gen 1 & Gen 3).",
        desc: "Wajib mengikuti seleksi terlebih dahulu. Kamu akan diverifikasi, submit karya, lalu AI menentukan generasimu otomatis berdasarkan caption video & jumlah followers.",
        cta: "Mulai Seleksi",
      },
      path2: {
        label: "Jalur 2",
        badge: "Tanpa Seleksi",
        title: "Jalur Langsung",
        audience: "Khusus creator anime, manga, manhwa, manhua, dan konten sejenis (Gen 2).",
        desc: "Tidak perlu seleksi rumit. Gen 2 khusus untuk creator konten anime, manga, manhwa, manhua — langsung masuk dan onboarding tanpa syarat followers.",
        cta: "Gabung Langsung",
      },
      reqTitle: "Syarat Umum",
      requirements: [
        { title: "Umur 13+", desc: "Wajib berusia minimal 13 tahun." },
        { title: "Creator aktif", desc: "Preset, AMV, anime edit, manga, atau konten kreatif lainnya." },
        { title: "Siap CN", desc: "Akun siap change name & pakai hashtag marga." },
      ],
      genReqTitle: "Syarat per Generasi",
      genReqDesc:
        "Tiga generasi dengan fokus konten berbeda. AI secara otomatis menentukan generasimu dari caption video & jumlah followers.",
      genRequirements: [
        {
          gen: "Gen 1",
          subtitle: "Creator Preset & AMV",
          followers: 500,
          note: "Minimal 500 followers TikTok. Wajib seleksi. Khusus creator preset, AMV, L2D, dan edit video.",
        },
        {
          gen: "Gen 2",
          subtitle: "Creator Anime & Manga",
          followers: 0,
          note: "Bebas followers, tanpa seleksi ketat. Khusus creator konten anime, manga, manhwa, manhua, dan sejenisnya.",
        },
        {
          gen: "Gen 3",
          subtitle: "Creator Preset & AMV (Pemula)",
          followers: 0,
          note: "Sama seperti Gen 1 tapi tanpa syarat followers minimal. Wajib seleksi. Cocok untuk yang baru mulai bikin konten preset/AMV/edit.",
        },
      ],
      flowTitle: "Alur Seleksi",
      flow: [
        "Masuk grup WhatsApp seleksi.",
        "Perkenalan & verifikasi akun TikTok.",
        "Submit karya / portfolio singkat.",
        "Review oleh admin marga.",
        "Pengumuman & onboarding ke Five Fail Family.",
      ],
      faqTitle: "FAQ",
      faqCount: "pertanyaan",
      faqs: [
        {
          q: "Apa itu Five Fail Family?",
          a: "Sebuah marga editor & kreator anime di TikTok. Tempat berkarya, kolaborasi, dan bertumbuh bareng dalam satu komunitas.",
        },
        {
          q: "Apa bedanya Gen 1, Gen 2, dan Gen 3?",
          a: "Gen 1 khusus creator preset, AMV, L2D, dan edit video dengan minimal 500 followers. Gen 2 khusus creator konten anime, manga, manhwa, dan manhua tanpa syarat followers. Gen 3 sama seperti Gen 1 tapi bebas followers — cocok untuk yang baru mulai.",
        },
        {
          q: "Bagaimana AI menentukan generasi saya?",
          a: "Saat kamu submit link video di step 4, AI membaca caption video secara otomatis. Kalau caption mengandung kata kunci anime/manga (misalnya 'One Piece', 'anime edit', 'manhwa', dll) maka kamu masuk Gen 2. Kalau mengandung kata kunci preset/AMV/edit, kamu masuk Gen 1 atau Gen 3 tergantung jumlah followers.",
        },
        {
          q: "Apakah wajib seleksi untuk semua gen?",
          a: "Gen 1 dan Gen 3 wajib seleksi lewat wizard di halaman ini. Gen 2 bisa langsung bergabung tanpa seleksi ketat — cukup ikuti jalur langsung.",
        },
        {
          q: "Apa saja syarat seleksi?",
          a: "Minimal usia 13 tahun, aktif sebagai creator, akun siap change name (CN), dan bersedia memakai hashtag resmi marga di setiap video.",
        },
        {
          q: "Apakah ada syarat followers untuk Gen 2 dan Gen 3?",
          a: "Tidak ada. Gen 2 dan Gen 3 bebas followers — bahkan akun baru pun bisa masuk. Hanya Gen 1 yang mensyaratkan minimal 500 followers.",
        },
        {
          q: "Berapa lama proses seleksinya?",
          a: "Proses di website berlangsung otomatis dalam hitungan menit. Setelah lolos, kamu punya batas waktu 5 menit untuk langsung join grup WhatsApp.",
        },
        {
          q: "Saya creator anime tapi punya 1.000 followers, masuk Gen berapa?",
          a: "Masuk Gen 2. Konten anime/manga selalu diprioritaskan untuk Gen 2 tanpa melihat jumlah followers.",
        },
        {
          q: "Saya creator preset tapi followers masih 100, masuk Gen berapa?",
          a: "Masuk Gen 3 — khusus creator preset/AMV/edit tanpa syarat followers minimal. Gen 3 adalah jalur masuk yang tepat untuk kamu.",
        },
        {
          q: "Apakah ada biaya?",
          a: "Tidak. Seleksi dan keanggotaan Five Fail Family 100% gratis.",
        },
        {
          q: "Kalau ditolak, boleh mendaftar lagi?",
          a: "Boleh. Perbaiki dulu konten/akun lalu daftar ulang setelah jeda minimal 7 hari.",
        },
        {
          q: "Apa itu change name (CN) dan kenapa wajib?",
          a: "CN adalah mengganti nama TikTok sesuai format marga Five Fail Family. Ini penting untuk identitas marga dan memudahkan orang mengenali member 5F di TikTok. Kamu wajib CN maksimal 1x24 jam setelah dinyatakan lolos.",
        },
        {
          q: "Apakah saya bisa pindah generasi setelah bergabung?",
          a: "Perpindahan gen diputuskan oleh admin berdasarkan perkembangan konten dan followers kamu. Hubungi admin marga untuk informasi lebih lanjut.",
        },
      ],
      ctaTitle: "Siap gabung?",
      ctaDesc: "Pilih jalurmu dan masuk grup sekarang - admin akan memandu langkah selanjutnya.",
      readme: "Baca Readme",
    },
    admin: {
      badge: "Tim di balik layar",
      title: "Tim Admin",
      desc: "Tim di balik layar yang menjaga marga tetap solid.",
      count: "admin aktif",
      owner: "Owner",
      genLabel: "3 Generasi",
      verified: "Terverifikasi",
    },
    gens: {
      title: "Generasi Five Fail",
      desc: "Tiga generasi, dalam satu marga.",
      items: [
        {
          subtitle: "Para Sepuh",
          body: "Generasi pertama yang membangun fondasi marga. Banyak senior, banyak pelajaran.",
        },
        {
          subtitle: "Anomali",
          body: "Generasi creator anime, manhwa, & manhua. Lagi naik level pelan-pelan.",
        },
        { subtitle: "Newbie", body: "Open Member" },
      ],
    },
    readme: {
      badge: "Panduan Marga",
      title: "Readme - Five Fail Family",
      intro:
        "Five Fail Family adalah marga editor & kreator anime di TikTok. Tempat ngumpul untuk belajar, kolaborasi project, dan mendapatkan teman baru.",
      purposeTitle: "Tujuan Utama",
      purposes: [
        "Wadah belajar editing anime untuk pemula sampai senior.",
        "Distribusi preset & resource buatan member secara gratis.",
        "Membangun branding marga lewat hashtag & konten kolaboratif.",
        "Menjaga ekosistem editor anime Indonesia tetap aktif & solid.",
      ],
      rolesTitle: "Divisi & Peran",
      roles: [
        {
          title: "Creator Preset",
          desc: "Bikin preset Alight Motion, CapCut, dan lain-lain untuk semua orang.",
        },
        {
          title: "Creator Anime",
          desc: "Produksi konten edit anime, AMV, manga edit, lyric edit. Quality control sebelum publish biar feed marga konsisten.",
        },
        {
          title: "Editor Senior",
          desc: "Mentor untuk member baru. Bantu review hasil edit, kasih masukan teknis, dan jaga kualitas output marga.",
        },
        {
          title: "Hashtag & Branding",
          desc: "Konsisten pakai #5fcreator dan #5ffamily tiap posting biar engagement marga terus naik.",
        },
        {
          title: "Kolaborasi Antar-Gen",
          desc: "Project bareng lintas generasi, collab edit, mass post, event tema bulanan.",
        },
        {
          title: "Open Recruitment",
          desc: "Selalu buka untuk member baru lewat jalur seleksi maupun jalur langsung.",
        },
      ],
      rulesTitle: "Aturan Singkat",
      rules: [
        "Hormati senior & member lain, no toxic, no drama.",
        "Wajib posting konten secara rutin.",
        "Pakai hashtag marga setiap upload TikTok.",
        "Siap CN (change name) sesuai format marga.",
      ],
      viewGens: "Lihat Generasi",
      ctaTitle: "Sudah paham semuanya?",
      ctaDesc: "Kalau sudah cocok sama tujuan & aturannya, langsung aja gas daftar jadi bagian dari marga.",
    },
    notFound: {
      title: "Halaman tidak ditemukan",
      desc: "Sepertinya kamu nyasar. Halaman yang kamu tuju sudah dipindah, dihapus, atau memang belum pernah ada di marga ini.",
    },
  },
  en: {
    nav: {
      home: "Home",
      watch: "Watch",
      generations: "Generations",
      admin: "Admins",
      readme: "Readme",
      join: "Join",
    },
    common: {
      back: "Back",
      members: "members",
      comingSoon: "Coming soon",
      joinNow: "Join Now",
      explore: "Explore",
    },
    home: {
      badge: "Always open for members",
      heroDesc:
        "A clan of anime editors & creators. A place to create, collaborate, and grow together.",
      statsTitle: "Clan Statistics",
      statsDesc: "Member count for each Five Fail Family generation.",
      gens: [
        {
          title: "Five Fail Family Gen 1",
          tag: "The elders' gen",
          desc: "The first generation that built the clan.",
        },
        {
          title: "Five Fail Family Gen 2",
          tag: "The anomaly gen",
          desc: "The second generation for anime, manhwa & manhua creators.",
        },
        {
          title: "Five Fail Family Gen 3",
          tag: "The newbie gen",
          desc: "Coming soon.",
        },
      ],
      footer: "Created By Kyu",
    },
    tiktok: {
      hashtagTitle: "Five Fail Hashtags",
      hashtagDesc: "Live data via TikTok",
      views: "Total Views",
      videos: "Total Videos",
      notFound: "Not found",
      loadFail: "Failed to load",
      rateLimit: "Failed to load (rate limit)",
      searchTitle: "Search TikTok Account",
      searchDesc: "Check any TikTok profile by username",
      searchPlaceholder: "tiktok username",
      searchBtn: "Search",
      accountNotFound: "Account not found.",
      searchFail: "Failed to load. Try again.",
      followers: "Followers",
      following: "Following",
      likes: "Likes",
      videosLabel: "Videos",
      member: "5F MEMBER",
      notMember: "NOT A MEMBER",
      memberDesc: "Detected as a Five Fail Family member",
      notMemberDesc: "Not detected as a Five Fail Family member yet",
    },
    join: {
      badge: "Open recruitment",
      title: "Join Five Fail Family",
      desc: "Pick the path that matches your creator type, then grow together with the clan.",
      pathsTitle: "Choose Your Path",
      pathsDesc: "Two different paths - read the descriptions before joining a group.",
      path1: {
        label: "Selection",
        badge: "Selection Required",
        title: "Selection Path",
        audience: "For preset, AMV, L2D, and video edit creators (Gen 1 & Gen 3).",
        desc: "You must go through selection first. You'll be verified, submit a video, and AI will automatically determine your generation based on caption content and follower count.",
        cta: "Start Selection",
      },
      path2: {
        label: "Direct Path",
        badge: "No Selection",
        title: "Direct Path",
        audience: "For anime, manga, manhwa, manhua content creators (Gen 2).",
        desc: "No strict selection needed. Gen 2 is dedicated to anime, manga, manhwa, manhua creators — join directly with no follower requirements.",
        cta: "Join Directly",
      },
      reqTitle: "General Requirements",
      requirements: [
        { title: "Age 13+", desc: "Must be at least 13 years old." },
        { title: "Active creator", desc: "Presets, AMV, anime edits, manga, or other creative content." },
        { title: "Ready to CN", desc: "Ready to change name & use the clan hashtags." },
      ],
      genReqTitle: "Requirements per Generation",
      genReqDesc:
        "Three generations with different content focuses. AI automatically assigns your generation from your video caption & follower count.",
      genRequirements: [
        {
          gen: "Gen 1",
          subtitle: "Preset & AMV Creator",
          followers: 500,
          note: "Minimum 500 TikTok followers. Selection required. For preset, AMV, L2D, and video edit creators.",
        },
        {
          gen: "Gen 2",
          subtitle: "Anime & Manga Creator",
          followers: 0,
          note: "No follower requirement, no strict selection. For anime, manga, manhwa, and manhua content creators.",
        },
        {
          gen: "Gen 3",
          subtitle: "Preset & AMV Creator (Beginner)",
          followers: 0,
          note: "Same as Gen 1 but no minimum follower requirement. Selection required. For those just starting out with preset/AMV/edit content.",
        },
      ],
      flowTitle: "Selection Flow (Path 1)",
      flow: [
        "Join the selection WhatsApp group.",
        "Introduce yourself & verify your TikTok account.",
        "Submit a short portfolio of your work.",
        "Review by clan admins.",
        "Announcement & onboarding into Five Fail Family.",
      ],
      faqTitle: "FAQ",
      faqCount: "questions",
      faqs: [
        {
          q: "What is Five Fail Family?",
          a: "A clan of anime editors & creators on TikTok. A place to create, collaborate, and grow together in one community.",
        },
        {
          q: "What's the difference between Gen 1, Gen 2, and Gen 3?",
          a: "Gen 1 is for preset, AMV, L2D, and video edit creators with at least 500 followers. Gen 2 is for anime, manga, manhwa, and manhua content creators with no follower requirement. Gen 3 is the same as Gen 1 but with no follower requirement — perfect for beginners.",
        },
        {
          q: "How does AI determine my generation?",
          a: "When you submit your video link in step 4, AI reads the caption automatically. If it contains anime/manga keywords (e.g. 'One Piece', 'anime edit', 'manhwa', etc.) you go into Gen 2. If it contains preset/AMV/edit keywords, you go into Gen 1 or Gen 3 depending on your follower count.",
        },
        {
          q: "Is selection required for all generations?",
          a: "Gen 1 and Gen 3 require selection through the wizard on this page. Gen 2 can join directly without strict selection.",
        },
        {
          q: "What are the selection requirements?",
          a: "At least 13 years old, active as a creator, account ready for a change name (CN), and willing to use the official clan hashtags on every video.",
        },
        {
          q: "Is there a follower requirement for Gen 2 and Gen 3?",
          a: "No. Gen 2 and Gen 3 have no follower requirements — even brand new accounts are welcome. Only Gen 1 requires a minimum of 500 followers.",
        },
        {
          q: "How long does the selection take?",
          a: "The process on the website is fully automatic and takes just minutes. Once you pass, you have 5 minutes to join the WhatsApp group.",
        },
        {
          q: "I make anime content but have 1,000 followers — which gen am I?",
          a: "Gen 2. Anime/manga content creators always go to Gen 2 regardless of follower count.",
        },
        {
          q: "I make preset content but only have 100 followers — which gen am I?",
          a: "Gen 3 — specifically for preset/AMV/edit creators with no minimum follower requirement. Gen 3 is the right path for you.",
        },
        {
          q: "Is there any fee?",
          a: "No. Selection and membership in Five Fail Family are 100% free.",
        },
        {
          q: "If rejected, can I apply again?",
          a: "Yes. Improve your content/account first, then reapply after at least 7 days.",
        },
        {
          q: "What is change name (CN) and why is it required?",
          a: "CN means changing your TikTok name to match the Five Fail Family clan format. It's important for clan identity and makes it easy for others to recognize 5F members on TikTok. You must CN within 24 hours of passing.",
        },
        {
          q: "Can I switch generations after joining?",
          a: "Generation changes are decided by admins based on your content growth and follower count. Contact the clan admins for more information.",
        },
      ],
      ctaTitle: "Ready to join?",
      ctaDesc: "Pick your path and join the group now - admins will guide you through the next steps.",
      readme: "Read the Readme",
    },
    admin: {
      badge: "Behind the scenes",
      title: "Admin Team",
      desc: "The team behind the scenes keeping the clan solid.",
      count: "active admins",
      owner: "Owner",
      genLabel: "3 Generations",
      verified: "Verified",
    },
    gens: {
      title: "Five Fail Generations",
      desc: "Three generations, one clan.",
      items: [
        {
          subtitle: "The Elders",
          body: "The first generation that built the clan's foundation. Many seniors, many lessons.",
        },
        {
          subtitle: "Anomaly",
          body: "The generation of anime, manhwa & manhua creators. Leveling up step by step.",
        },
        { subtitle: "Newbie", body: "Coming soon." },
      ],
    },
    readme: {
      badge: "Clan Guide",
      title: "Readme - Five Fail Family",
      intro:
        "Five Fail Family is a clan of anime editors & creators on TikTok. A place to learn, collaborate on projects, and make new friends.",
      purposeTitle: "Main Goals",
      purposes: [
        "A place to learn anime editing, from beginners to seniors.",
        "Free distribution of member-made presets & resources.",
        "Building the clan's brand through hashtags & collaborative content.",
        "Keeping the Indonesian anime editor ecosystem active & solid.",
      ],
      rolesTitle: "Divisions & Roles",
      roles: [
        {
          title: "Preset Creator",
          desc: "Create Alight Motion, CapCut, and other presets for everyone.",
        },
        {
          title: "Anime Creator",
          desc: "Produce anime edits, AMVs, manga edits, lyric edits. Quality control before publishing to keep the clan feed consistent.",
        },
        {
          title: "Senior Editor",
          desc: "Mentors for new members. Help review edits, give technical feedback, and maintain the clan's output quality.",
        },
        {
          title: "Hashtag & Branding",
          desc: "Consistently use #5fcreator and #5ffamily on every post to keep the clan's engagement growing.",
        },
        {
          title: "Cross-Gen Collaboration",
          desc: "Cross-generation projects, collab edits, mass posts, monthly themed events.",
        },
        {
          title: "Open Recruitment",
          desc: "Always open for new members via the selection path or the direct path.",
        },
      ],
      rulesTitle: "Quick Rules",
      rules: [
        "Respect seniors & fellow members - no toxicity, no drama.",
        "Post content regularly.",
        "Use the clan hashtags on every TikTok upload.",
        "Be ready to CN (change name) following the clan format.",
      ],
      viewGens: "View Generations",
      ctaTitle: "Got the full picture?",
      ctaDesc: "If the goals & rules sound like your vibe, go ahead and apply to join the clan.",
    },
    notFound: {
      title: "Page not found",
      desc: "Looks like you're lost. The page you're looking for has been moved, deleted, or never existed in this clan.",
    },
  },
} as const;

export type Dict = (typeof dictionaries)["id"];

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
};

const I18nContext = createContext<I18nContextValue>({
  lang: "id",
  setLang: () => {},
  t: dictionaries.id,
});

const STORAGE_KEY = "ff-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "id") setLangState(saved);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: dictionaries[lang] as Dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
        }
