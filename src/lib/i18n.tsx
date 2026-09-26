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
        audience: "Khusus untuk creator preset, l2d, anime, manga, manhwa, manhua, dan sejenisnya.",
        desc: "Wajib mengikuti seleksi terlebih dahulu. Kamu akan diverifikasi, submit karya, lalu direview oleh admin sebelum resmi bergabung.",
        cta: "Mulai Seleksi",
      },
      path2: {
        label: "Jalur 2",
        badge: "Tanpa Seleksi",
        title: "Jalur Langsung",
        audience: "Khusus creator anime, manhwa, manhua, dan lain-lain.",
        desc: "Tidak perlu melakukan seleksi. Gen ini khusus untuk creator anime, manhwa, manhua, dan konten sejenis - langsung masuk dan onboarding.",
        cta: "Gabung Langsung",
      },
      reqTitle: "Syarat Umum",
      requirements: [
        { title: "Umur 13+", desc: "Wajib berusia minimal 13 tahun." },
        { title: "Creator aktif", desc: "Preset, anime edit, atau konten kreatif lainnya." },
        { title: "Siap CN", desc: "Akun siap change name & pakai hashtag marga." },
      ],
      genReqTitle: "Syarat Followers per Generasi",
      genReqDesc:
        "Tiap generasi punya standar followers minimal yang berbeda. Cek dulu kamu masuk kategori yang mana.",
      genRequirements: [
        {
          gen: "Gen 1",
          subtitle: "Para Sepuh",
          followers: 500,
          note: "Minimal 500 followers TikTok, wajib lolos seleksi (Jalur 1), khusus creator preset & L2D.",
        },
        {
          gen: "Gen 2",
          subtitle: "Anomali",
          followers: 200,
          note: "Minimal 200 followers TikTok, aktif sebagai creator anime, manhwa, atau manhua.",
        },
        {
          gen: "Gen 3",
          subtitle: "Newbie",
          followers: 0,
          note: "Open member, tanpa syarat followers minimal - cocok untuk yang baru mulai.",
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
          a: "Sebuah marga editor & kreator anime di TikTok. Tempat berkarya, kolaborasi, dan bertumbuh bareng.",
        },
        {
          q: "Apakah wajib seleksi?",
          a: "Ya, kalian harus seleksi terlebih dahulu sebelum masuk ke grup utama..",
        },
        {
          q: "Apa saja syarat seleksi?",
          a: "Minimal usia 13 tahun, aktif sebagai creator, akun siap change name (CN), dan bersedia memakai hashtag resmi marga.",
        },
        {
          q: "Berapa lama proses seleksinya?",
          a: "Umumnya 1–7 hari tergantung antrean. Hasil diumumkan langsung di grup seleksi.",
        },
        {
          q: "Apakah ada biaya?",
          a: "Tidak. Seleksi dan keanggotaan Five Fail Family 100% gratis.",
        },
        {
          q: "Kalau ditolak, boleh mendaftar lagi?",
          a: "Boleh. Perbaiki dulu konten/akun lalu daftar ulang setelah jeda minimal 7 hari.",
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
        label: "Path 1",
        badge: "Selection Required",
        title: "Selection Path",
        audience: "For preset creators, L2D, and similar.",
        desc: "You must pass a selection first. You'll be verified, submit your work, and be reviewed by admins before officially joining.",
        cta: "Start Selection",
      },
      path2: {
        label: "Path 2",
        badge: "No Selection",
        title: "Direct Path",
        audience: "For anime, manhwa, manhua creators, and more.",
        desc: "No selection needed. This gen is dedicated to anime, manhwa, manhua, and similar content creators - join directly and get onboarded.",
        cta: "Join Directly",
      },
      reqTitle: "General Requirements",
      requirements: [
        { title: "Age 13+", desc: "Must be at least 13 years old." },
        { title: "Active creator", desc: "Presets, anime edits, or other creative content." },
        { title: "Ready to CN", desc: "Ready to change name & use the clan hashtags." },
      ],
      genReqTitle: "Follower Requirements per Generation",
      genReqDesc:
        "Each generation has a different minimum follower standard. Check which category you fit into first.",
      genRequirements: [
        {
          gen: "Gen 1",
          subtitle: "Veterans",
          followers: 500,
          note: "Minimum 500 TikTok followers, must pass selection (Path 1), for preset & L2D creators only.",
        },
        {
          gen: "Gen 2",
          subtitle: "Anomaly",
          followers: 200,
          note: "Minimum 200 TikTok followers, active as an anime, manhwa, or manhua creator.",
        },
        {
          gen: "Gen 3",
          subtitle: "Newbie",
          followers: 0,
          note: "Open member, no minimum follower requirement - great for those just starting out.",
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
          a: "A clan of anime editors & creators on TikTok. A place to create, collaborate, and grow together.",
        },
        {
          q: "What's the difference between Path 1 and Path 2?",
          a: "Path 1 is for preset creators, L2D, etc. and requires selection first. Path 2 has no selection and is dedicated to anime, manhwa, and manhua creators.",
        },
        {
          q: "What are the selection requirements?",
          a: "At least 13 years old, active as a creator, account ready for a change name (CN), and willing to use the official clan hashtags.",
        },
        {
          q: "How long does the selection take?",
          a: "Usually 1–7 days depending on the queue. Results are announced directly in the selection group.",
        },
        {
          q: "Is there any fee?",
          a: "No. Selection and membership in Five Fail Family are 100% free.",
        },
        {
          q: "If rejected, can I apply again?",
          a: "Yes. Improve your content/account first, then reapply after at least 7 days.",
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
