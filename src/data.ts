import { Ebook, Article, Review } from './types';

export const EBOOK_CATEGORIES = [
  'Semua Kategori',
  'Pengembangan Diri',
  'Teknologi & Koding',
  'Sastra & Fiksi',
  'Bisnis & Finansial',
  'Edukasi & Sains',
  'Culinary & Hobi'
];

export const INITIAL_EBOOKS: Ebook[] = [
  {
    id: 'eb-1',
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    category: 'Pengembangan Diri',
    price: 85000,
    rating: 4.8,
    isPopular: true,
    isNew: false,
    dateAdded: '2026-01-10',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    description: 'Buku panduan praktis filsafat Yunani-Romawi Kuno (Stoikisme) untuk membantu kita mengatasi kekhawatiran dan mengendalikan emosi negatif dalam kehidupan sehari-hari. Sangat cocok bagi generasi muda menghadapi kecemasan modern, quarter-life crisis, dan tuntutan dunia yang cepat.',
    pages: [
      "BAB 1: KECEMASAN MODERN DAN SOLUSI KUNO\n\nSelamat datang di lembaran Filosofi Teras. Apakah Anda sering merasa stres di jalan raya karena macet? Khawatir akan masa depan karir Anda? Atau merasa tersinggung dengan komentar orang lain di media sosial?\n\nSemua kekhawatiran ini adalah bagian dari kehidupan modern. Menariknya, lebih dari 2.000 tahun yang lalu, di Yunani Kuno, sekelompok filsuf berkumpul di 'Stoa' (teras beratap) untuk membahas persoalan yang sama. Mereka menemukan sebuah cara pandang hidup yang disebut Stoikisme.\n\nStoikisme bukan pemikiran yang rumit atau teoretis abstrak. Ini adalah filosofi praktis yang dirancang untuk hidup tenang, tabah, bebas dari emosi negatif, dan tangguh di tengah rintangan.",
      "BAB 2: DIKOTOMI KENDALI (TRIK SUPER STOIK)\n\nInilah pilar utama dari Filosofi Teras: Dikotomi Kendali.\n\nDalam hidup ini, ada hal-hal yang berada di bawah kendali kita (internal), dan ada hal-hal yang di luar kendali kita (external).\n\nHal yang berada DI BAWAH KENDALI kita:\n1. Pikiran kita sendiri\n2. Opini kita\n3. Tindakan dan respons kita\n4. Keinginan dan tujuan kita\n\nHal yang DI LUAR KENDALI kita:\n1. Tindakan orang lain\n2. Cuaca, kemacetan, bencana alam\n3. Opini orang lain tentang kita\n4. Hasil akhir dari usaha kita.\n\nKebanyakan stres kita muncul karena kita menghabiskan energi untuk mencoba mengontrol hal-hal di luar kendali kita, sementara kita mengabaikan hal-hal yang benar-benar bisa kita kontrol.",
      "BAB 3: KHAWATIR DENGAN APA YANG BELUM TERJADI?\n\nSeneca pernah menulis: 'Kita lebih sering menderita dalam imajinasi kita dibanding dalam realitas.'\n\nBerapa kali Anda panik mencemaskan ujian atau presentasi esok hari, membayangkan kegagalan terburuk, namun ketika hal tersebut dilaksanakan ternyata berjalan biasa-biasa saja? Pikiran kita adalah pabrik pembuat drama terbaik.\n\nStoik melatih apa yang disebut 'Premeditatio Malorum'—membayangkan skenario terburuk terlebih dahulu, bukan untuk menjadi pesimis, melainkan agar mental kita siap. Ketika kita sudah siap, kecemasan itu akan mereda, meninggalkan kejernihan berpikir untuk menyusun strategi.",
      "BAB 4: MENGENDALIKAN RESPONS (STIMULUS VS RESPONS)\n\nAntara stimulus (kejadian luar) dan respons (reaksi kita), terdapat sebuah ruang kosong. Di ruang kosong itulah terletak kebebasan kita untuk memilih respons terbaik.\n\nJika seseorang memaki Anda (stimulus), Anda tidak harus langsung marah (respons otomatis). Anda bisa berhenti sejenak, bernapas, dan bertanya: 'Apakah makian ini benar-benar menyakiti jiwa saya, atau ini hanya suara berisik?'\n\nHanya Anda yang bisa mengizinkan diri Anda merasa terluka. Tanpa persetujuan Anda, kata-kata orang lain tidak memiliki kekuatan apapun bagi ketenangan batin Anda.",
      "BAB 5: AMOR FATI & HIDUP SELARAS DENGAN ALAM\n\n'Amor Fati' berarti mencintai takdir Anda, apapun bentuknya. Ini bukan sekadar pasrah pasif, melainkan penerimaan aktif atas realitas yang telah terjadi, sehingga kita bisa melangkah maju tanpa penyesalan.\n\nKetika nasi sudah menjadi bubur, seorang Stoik tidak akan menangisinya. Mereka akan menuangkan kecap, menaburkan kerupuk, kacang, bawang goreng, seledri, dan menjadikannya bubur ayam yang lezat! Jadilah proaktif dan hargai setiap momen kehidupan."
    ]
  },
  {
    id: 'eb-2',
    title: 'Belajar React & Next.js Modern',
    author: 'Rian Wijaya, M.Kom',
    category: 'Teknologi & Koding',
    price: 125000,
    rating: 4.9,
    isPopular: true,
    isNew: true,
    dateAdded: '2026-05-20',
    coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400',
    description: 'Panduan terlengkap membangun aplikasi web modern berskala besar menggunakan React 19, Vite, Tailwind CSS, dan Next.js App Router. Dilengkapi dengan studi kasus nyata, pembuatan REST API, optimasi SEO, serta deployment ke cloud platform.',
    pages: [
      "BAB 1: PENGANTAR REACT MODERN\n\nSelamat datang di era React Modern! React adalah pustaka JavaScript yang sangat populer untuk membangun antarmuka pengguna (UI) yang interaktif, cepat, dan modular.\n\nPada versi terbaru React 19, kita disuguhkan berbagai fitur luar biasa seperti Compiler otomatis, Actions untuk penanganan form state, server components, serta integrasi aset yang lebih ciamik.\n\nDalam buku ini, kita akan memulai perjalanan dari dasar: memahami konsep Component, Props, State, dan siklus hidup re-rendering sebelum melangkah ke framework tingkat lanjut.",
      "BAB 2: MEMAHAMI STATE DAN COMPONENT LIFE\n\nState adalah memori dari sebuah component. Tanpa state, component Anda akan statis dan tidak responsif terhadap tindakan pengguna.\n\nAturan penting penggunaan React State:\n1. Jangan pernah memodifikasi variabel state secara langsung (gunakan fungsi setter).\n2. Jaga state sedekat mungkin dengan tempat ia digunakan.\n3. Gunakan 'useEffect' dengan bijaksana untuk efek samping luar, pastikan dependency array terdefinisi dengan sangat rapi guna menghindari 'infinite loop' yang berbahaya bagi memori browser.",
      "BAB 3: PERALIKAN KE FRAMEWORK NEXT.JS\n\nMengapa kita memerlukan Next.js? React sendiri merupakan library UI, bukan framework lengkap. Untuk menangani routing halaman, rendering di server (SSR), optimasi SEO, dan performa tinggi secara default, Next.js hadir sebagai solusi standar industri.\n\nDengan App Router modern berbasis direktori 'app/', Anda dapat membuat Server Components yang merender HTML langsung di server, mengurangi ukuran bundel JavaScript yang dikirimkan ke pengguna, dan meningkatkan Core Web Vitals.",
      "BAB 4: TAILWIND CSS UNTUK STYLING KILAT\n\nTailwind CSS merevolusi cara kita mendesain aplikasi web. Melalui utility classes seperti 'flex', 'items-center', 'justify-between', 'p-4', 'bg-slate-900', kita dapat menyusun tata letak responsif langsung di dalam class file TypeScript tanpa menulis CSS terpisah yang menumpuk panjang.\n\nSinergi antara React Component dan Tailwind CSS mempermudah style modular dinamis berdasarkan state komponen dengan class helper sederhana seperti clsx atau cn() utility.",
      "BAB 5: DEPLOYMENT DAN OPTIMASI PERFORMA\n\nMembangun aplikasi hanyalah separuh jalan. Menampilkannya ke khalayak umum dengan performa maksimal dan ramah mesin pencari (SEO) adalah langkah krusial akhir.\n\nKita akan membahas teknik Static Site Generation (SSG), caching agresif, optimasi memuat gambar otomatis, serta integrasi web analytics sebelum mendeploy sistem menggunakan platform cloud dalam hitungan detik."
    ]
  },
  {
    id: 'eb-3',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    category: 'Sastra & Fiksi',
    price: 79000,
    rating: 4.7,
    isPopular: false,
    isNew: false,
    dateAdded: '2025-11-05',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
    description: 'Kisah legendaris sepuluh anak Belitong yang berjuang mengejar mimpi dan pendidikan di sebuah sekolah reot SD Muhammadiyah Belitong. Buku penuh haru, persahabatan erat, cinta monyet, tekad baja, dan rasa humor yang tinggi di tengah kemiskinan daerah tambang timah.',
    pages: [
      "BAGIAN 1: SEKOLAH YANG HAMPIR ROBOH\n\nPagi itu, matahari bersinar agak pucat di atas pulau Belitong. Di halaman SD Muhammadiyah, sepuluh pasang mata cemas menatap jalan setapak berpasir merah. \n\nPak Harfan dan Bu Mus berdiri di depan pintu kelas yang miring. Aturan pemerintah sangat kejam: jika murid baru tidak mencapai sepuluh orang, sekolah paling miskin di Belitong ini harus ditutup selamanya.\n\nSembilan anak telah duduk gemetar di bangku kayu lapuk. Harapan hampir padam ketika waktu menunjukkan pukul sepuluh siang. Namun tiba-tiba, muncul sesosok anak berambut ikal bersama ibunya dari kejauhan. Lintang! Dialah penyelamat sekolah reot kami.",
      "BAGIAN 2: SEPOELOEH LASKAR PELANGI\n\nSejak hari bersejarah itu, Bu Mus menamai kami sepuluh murid dengan sebutan 'Laskar Pelangi'. \n\nNama-nama indah diukir dalam sejarah persahabatan kami: Ikal yang puitis, Lintang si jenius matematika dari pesisir pantai, Mahar seorag seniman eksentrik penyembah mistis hutan, Sahara satu-satunya anak perempuan berkepribadian tangguh, A Kiong yang setia, Syahdan si mungil pekerja keras, Kucai sang ketua kelas yang pandai beretorika, Borek yang terobsesi pada otot besar, Trapani si anak mami yang tampan, dan Harun si pengedar senyum tulus yang lambat berpikir.\n\nDi bawah atap bocor dan dinding bolong-bolong, semangat kami terbang menembus batas awan.",
      "BAGIAN 3: LINTANG, SANG JENIUS DARI RAWA-RAWA\n\nSetiap pagi, sebelum matahari menyentuh pucuk dedaunan, Lintang harus mengayuh sepedanya sejauh 40 kilometer melintasi padang rumput, rawa-rawa penuh buaya, dan jalanan pasir yang berdebu.\n\nIa adalah anak seorang nelayan miskin yang tak bisa membaca halaman koran sekalipun. Namun di dalam kepala kecil Lintang, bersarang kecerdasan luar biasa yang menandingi ilmuwan tingkat tinggi. \n\nBaginya, matematika bukanlah momok menakutkan, melainkan sebuah simfoni angka indah yang menari-nari menanti untuk dipecahkan.",
      "BAGIAN 4: LOMBA CERDAS CERMAT YANG MENGGUNCANG\n\nHari yang dinanti tiba: Lomba Cerdas Cermat se-kabupaten Belitong. Sekolah kami, sekolah tanpa lantai semen, harus berhadapan dengan sekolah elite milik PN Timah yang mewah dan didukung fasilitas termutakhir.\n\nSeluruh hadirin meremehkan tim kumuh SD Muhammadiyah yang hanya mengenakan kemeja lusuh berkerah miring. Namun ketika babak krusial mengenai perhitungan fisika dan geografi dijalankan, jemari Lintang bergerak cepat bagai badai.\n\nIa mematahkan teori guru pembimbing sekolah PN Timah dalam argumentasi sengit yang legendaris, membuat seluruh aula berdiri bergemuruh memberikan tepuk tangan kehormatan bagi kemenangan mutlak Laskar Pelangi.",
      "BAGIAN 5: AKHIR SEBUAH IMPIAN\n\nNamun hidup tidak selalu ramah pada anak-anak pahlawan kami.\n\nSuatu sore, kabar duka datang bagai petir menyambar di musim kemarau. Ayah Lintang wafat di tengah samudra yang ganas, meninggalkan keluarga besar tanpa tulang punggung penopang hidup.\n\nLintang, anak jenius yang memimpikan gelar doktor astronomi, harus meletakkan pensilnya selamanya, menaruh sepeda lamanya di gudang berdebu, dan bekerja kasar membelah kayu demi menyuapi adik-adik kecilnya. Kisahnya adalah potret getir kesenjangan pendidikan di bumi pertiwi yang kaya raya."
    ]
  },
  {
    id: 'eb-4',
    title: 'Manajemen Bisnis Digital 101',
    author: 'Prof. Dr. Ir. Diana Lestari',
    category: 'Bisnis & Finansial',
    price: 110000,
    rating: 4.6,
    isPopular: false,
    isNew: true,
    dateAdded: '2026-03-15',
    coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
    description: 'Buku komprehensif bagi wirausahawan, manajer, dan mahasiswa bisnis untuk memahami peta ekosistem e-commerce, transformasi digital perusahaan tradisional, pemasaran digital (SEO, SEM & Social Media Campaign), serta metrik keberhasilan startup.',
    pages: [
      "BAB 1: ERA DISRUPSI DIGITAL\n\nSelamat datang di panduan Bisnis Digital 101. Dunia bisnis hari ini bergerak lebih cepat daripada sebelumnya. Transformasi digital bukan lagi sekadar opsi sekunder bagi perusahaan, melainkan keharusan mutlak untuk bertahan hidup (survival).\n\nKita melihat raksasa ritel tradisional runtuh karena lambat mengadopsi e-commerce, sementara startup lokal kecil yang fleksibel berkembang pesat memanfaatkan media sosial dan aplikasi pengiriman instan. \n\nMari kita telaah apa saja fondasi utama bisnis digital di era disrupsi.",
      "BAB 2: METODE LEAN STARTUP\n\nMetode Lean Startup yang dipopulerkan oleh Eric Ries mengajarkan kita untuk membangun bisnis dengan meminimalkan pemborosan waktu dan biaya.\n\nKuncinya adalah MVP (Minimum Viable Product)—produk versi paling sederhana yang mampu memberikan nilai bagi pengguna dasar sehingga kita dapat mengumpulkan umpan balik (feedback) nyata secepat mungkin.\n\nSiklusnya sederhana: Build (Bangun), Measure (Ukur), Learn (Pelajari). Jangan habiskan miliaran rupiah membuat sistem super rumit sebelum memvalidasi apakah ada pasar yang mau membayarnya.",
      "BAB 3: DIGITAL MARKETING & FUNNELING\n\nBagaimana cara mendapatkan pelanggan secara digital?\n\nKita mengenal konsep Marketing Funnel:\n1. Awareness (Kesadaran): Menarik calon pelanggan lewat konten edukatif / iklan.\n2. Interest (Ketertarikan): Mereka menyukai produk Anda dan mulai mem-follow.\n3. Consideration (Pertimbangan): Mereka membandingkan harga dan membaca review ebook Anda.\n4. Conversion (Pembelian): Transaksi sukses!\n\nPahami perbedaan organik SEO dengan berbayar Google Ads serta Facebook/TikTok Ads untuk mengoptimalkan ROI (Return on Investment) iklan bisnis Anda.",
      "BAB 4: UNIT ECONOMICS & METRIK KEUANGAN\n\nSebuah bisnis tidak akan bertahan jika biaya mendapatkan pelanggan lebih mahal dari keuntungan yang mereka berikan.\n\nDua metrik krusial yang wajib dihafal:\n- CAC (Customer Acquisition Cost): Total biaya pemasaran dibagi jumlah pelanggan baru yang didapat.\n- LTV (Lifetime Value): Total margin keuntungan bersih yang diberikan satu pelanggan selama mereka bertransaksi di platform Anda.\n\nRumus sukses: LTV harus minimal 3 kali lipat lebih besar dari CAC (LTV > 3x CAC)!"
    ]
  },
  {
    id: 'eb-5',
    title: 'Keajaiban Fisika Quantum Semesta',
    author: 'Dr. Ahmad Fauzi',
    category: 'Edukasi & Sains',
    price: 0, // FREE Ebook! Great for testing
    rating: 4.5,
    isPopular: true,
    isNew: false,
    dateAdded: '2025-08-12',
    coverUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=400',
    description: 'Eksplorasi konsep fisika modern yang ramah dibaca semua kalangan. Mengungkap misteri partikel sub-atomik, superposition, kuantum keterikatan (entanglement), teori relativitas Einstein, hingga potensi teknologi komputer kuantum masa depan.',
    pages: [
      "BAB 1: DUNIA SANGAT KECIL YANG ANEH\n\nKetika kita melihat buah apel jatuh dari pohonnya, hukum fisika klasik Isaac Newton bekerja dengan sangat teoretis dan mudah diprediksi. \n\nNamun, jika kita menyelam masuk ke dunia sub-atomik—dunia elektron, proton, dan foton cahaya—seluruh hukum klasik tersebut runtuh berantakan secara dramatis.\n\nSelamat datang di Fisika Quantum! Di sinilah partikel bisa berada di dua tempat berbeda sekaligus, menembus dinding penghalang yang kokoh bagai hantu, dan berkomunikasi seketika melompati jarak jutaan tahun cahaya.",
      "BAB 2: SUPERPOSISI: KUCING SCHRODINGER\n\nBagaimana mungkin sebuah partikel berada di dua tempat/kondisi sekaligus?\n\nKonsep ini disebut Superposisi. Untuk menjelaskannya, fisikawan Erwin Schrodinger membuat eksperimen pikiran yang terkenal: Kucing Schrodinger.\n\nBayangkan seekor kucing terkunci dalam kotak tertutup bersama racun yang akan rilis jika sebuah atom radioaktif meluruh (kejadian acak kuantum). Sebelum kotak dibuka untuk dinilai, secara matematis atom berkondisi meluruh DAN tidak meluruh secara bersamaan. \n\nArtinya, kucing tersebut berada dalam keadaan HIDUP sekaligus MATI pada saat bersamaan, sampai seorang pengamat membuka kotak dan memaksanya memilih satu realitas padat.",
      "BAB 3: ENTANGLEMENT: HUBUNGAN SERAM JARAK JAUH\n\nAlbert Einstein pernah menyebut fenomena ini sebagai 'Spooky action at a distance' (Aksi seram jarak jauh).\n\nQuantum Entanglement terjadi ketika dua partikel saling terikat secara misterius sejak mereka dilahirkan. Jika Anda mengubah orientasi putaran (spin) dari partikel A, maka partikel B yang terletak di ujung galaksi lain akan seketika mengubah putarannya secara berlawanan pada mikrodetik yang sama!\n\nKecepatan transfer informasi kutub kuantum ini melangkahi batas kecepatan cahaya, menimbulkan misteri fisika terdalam yang kini menjadi fondasi masa depan enkripsi data tingkat tinggi pertahanan negara."
    ]
  },
  {
    id: 'eb-6',
    title: 'Gadis Kretek',
    author: 'Ratih Kumala',
    category: 'Sastra & Fiksi',
    price: 95000,
    rating: 4.8,
    isPopular: true,
    isNew: false,
    dateAdded: '2025-10-30',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    description: 'Sebuah epos berdarah industri tembakau cengkeh nusantara, melintasi masa penjajahan Jepang, kemerdekaan hingga era modern. Berbalut aroma gurih saus kretek rahasia, persaingan bisnis keluarga yang sengit, intrik pengkhianatan politik, dan cinta sejati yang tak sampai antara Jeng Yah dan Soeraja.',
    pages: [
      "BAGIAN 1: PERMINTAAN TERAKHIR RAMASOERAJA\n\nBau obat antiseptik memenuhi kamar rumah sakit yang temaram. Romo Soeraja menjelang ajal, tubuhnya kurus dan bicaranya mengigau tidak jelas. \n\nNamun di sela batuk darahnya yang tersengal, ia terus menerus membisikkan satu nama yang asing bagi seluruh keturunannya: 'Jeng Yah... Jeng Yah...'\n\nKetiga putranya, Tegar, Karim, dan Lebas, saling berpandangan heran. Siapakah perempuan bernama Jeng Yah ini? Mengapa bukan nama ibu mereka, Purwanti, yang disebutnya di ujung napas? Demi memenuhi kerinduan terakhir sang ayah, Lebas memutuskan menjelajahi kota-kota pedalaman Jawa Tengah guna menelusuri legenda masa lalu industrial kretek keluarga.",
      "BAGIAN 2: PASAR KRETEK KOTA KOTA GADIS\n\nPencarian Lebas membawanya ke kota M, sebuah kota kecamatan kecil penghasil tembakau legendaris di masa lampau.\n\nDi sanalah, di balik lipatan debu pabrik-pabrik tembakau tua yang kini telantar, kisah cinta sang ayah dan Dasiyah (Jeng Yah) terkuak lebar.\n\nDasiyah adalah putri sulung Idroes Moeria, seorang saudagar kretek sukses nan terpandang di zamannya. Ia bukan gadis biasa yang gemar bersolek; jemari Dasiyah memiliki bakat alami yang magis dalam mencium dan meracik saus kretek paling harum nan gurih, sebuah posisi yang lazimnya didominasi kaum lelaki perkasa.",
      "BAGIAN 3: RAHASIA SAUS GURIH KRETEK GADIS\n\nSaus adalah jiwa dari kretek. Tanpa saus yang pas, gulungan tembakau dan cengkeh bermutu tinggi sekalipun akan terasa hambar di tenggorokan.\n\nSetiap malam, di laboratorium rahasianya, Dasiyah bereksperimen mengombinasikan air mawar, madu lebah hutan, dan kayu manis pilihan ke dalam adonan cengkeh rajang.\n\nKetika Soeraja, seorang buruh pemuda miskin yang cerdas nan ulet masuk ke kehidupan pabrik Idroes Moeria, benih-benih asmara mulai mekar seiring terciptanya 'Kretek Gadis'—merek rokok legendaris yang menguasai pasar Jawa Tengah karena kelezatan racikan tangan dingin sang gadis."
    ]
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: '5 Cara Konsisten Membaca Buku Setiap Hari',
    summary: 'Merasa sibuk dan tidak punya waktu membaca? Ikuti tips praktis ini untuk membangun kebiasaan membaca minimal 15 halaman setiap hari tanpa terbeban.',
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
    category: 'Gaya Hidup',
    date: '2026-06-05',
    readTime: '4 Menit Baca',
    content: 'Membaca buku adalah investasi terbaik untuk otak kita. Sayangnya, godaan media sosial dan kesibukan harian sering mencuri fokus kita. Berikut 5 tips praktis:\n\n1. Sediakan Waktu Khusus (Golden Hour)\nDedikasikan 15 menit tepat setelah bangun tidur atau sebelum tidur malam tanpa menyentuh ponsel.\n\n2. Aturan 5 Halaman\nJika merasa malas, katakan pada diri sendiri untuk "hanya membaca 5 halaman". Biasanya setelah melewati 5 halaman, Anda akan keterusan membaca lebih banyak.\n\n3. Gunakan Aplikasi Ebook Reader Online\nDengan aplikasi ebook di ponsel atau laptop, Anda dapat membaca saat antre komuter, menunggu makanan, atau waktu senggang lainnya dengan fitur bookmark otomatis.\n\n4. Kurangi Screen Time\nGanti 30 menit jatah scrolling Instagram/TikTok dengan membuka buku.\n\n5. Jangan Membaca Buku yang Anda Benci\nJika suatu buku terasa membosankan setelah 50 halaman, letakkan dan cari buku lain yang lebih memikat hati.'
  },
  {
    id: 'art-2',
    title: 'Mengapa Stoikisme Sangat Populer di Kalangan Gen Z?',
    summary: 'Membahas fenomena kebangkitan ajaran filsafat kuno Yunani-Romawi di tengah gempuran tren media sosial dan kesehatan mental anak muda modern.',
    coverUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400',
    category: 'Psikologi',
    date: '2026-05-18',
    readTime: '6 Menit Baca',
    content: 'Belakangan ini, kata "Stoik" atau "Stoikisme" sering berseliweran di media sosial. Buku-buku pengembangan diri bertema stoik seperti Filosofi Teras laris manis dikonsumsi generasi Z.\n\nMengapa filsafat yang lahir sebelum masehi ini mendadak relevan kembali?\n\nJawabannya terletak pada tingkat stres perkotaan dan kecemasan eksternal yang dihadapi anak muda saat ini. Lewat era informasi, Gen Z terpapar ratusan opini digital, gaya hidup mewah orang lain, perang, krisis iklim, hingga tren komparasi sosial instan.\n\nStoikisme menawarkan penawar instan melalui Dikotomi Kendali: mengajarkan anak muda memilah mana hal yang bisa mereka kendalikan (usaha, respons, opini diri) dan membuang kekhawatiran atas hal-hal yang tidak bisa dikontrol (opini netizen, algoritma sosial, masa depan makroekonomi). Hasilnya adalah batin yang lebih kokoh dan tenang.'
  },
  {
    id: 'art-3',
    title: 'Mengenal Teknologi AI yang Membantu Penulis Ebook',
    summary: 'Bagaimana kecerdasan buatan membantu meriset ide cerita, membetulkan tata bahasa, dan membuat cover ilustrasi tanpa menggantikan kreativitas manusia.',
    coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400',
    category: 'Teknologi',
    date: '2026-04-22',
    readTime: '5 Menit Baca',
    content: 'Kecerdasan buatan (AI) kini bukan lagi sekadar fiksi ilmiah. Di industri penerbitan ebook, para penulis menggunakan model bahasa besar seperti Gemini untuk melipatgandakan produktivitas mereka.\n\nAI tidak digunakan untuk menjiplak tulisan, but sebagai asisten kreatif cerdas. Mulai dari merapikan outline bab buku, memunculkan saran kosa kata puitis, merevisi ejaan bahasa Indonesia yang kurang baku, hingga merancang kerangka plot detektif yang bebas celah logika.\n\nDengan perpaduan imajinasi emosional orisinal manusia dan efisiensi olah data AI, proses publikasi karya literasi bermutu tinggi kini bisa diselesaikan dalam hitungan minggu ketimbang bulan.'
  }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Andi Pratama',
    role: 'Mahasiswa IT',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    feedback: 'Website ebook terbaik! Berkat buku "Belajar React Modern", saya berhasil menyelesaikan skripsi dan magang di software house ternama. Fitur Reader Ebook di web sangat ringan dan bookmarknya berjalan otomatis.'
  },
  {
    id: 't-2',
    name: 'Siti Rahma',
    role: 'Ibu Rumah Tangga & Blogger',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    feedback: 'Saya suka sekali membaca "Filosofi Teras" waktu santai sore lewat HP. Interface-nya sangat nyaman di mata karena bisa beralih ke Dark Mode, dan tidak perlu repot-repot install aplikasi tambahan.'
  },
  {
    id: 't-3',
    name: 'Budi Hartono',
    role: 'Creative Designer',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100',
    feedback: 'Sangat praktis untuk membeli referensi design dan bisnis. Pembayarannya super cepat dengan QRIS simulator yang canggih. Dashboard penggunanya rapi, bikin ketagihan koleksi buku baru.'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    ebookId: 'eb-1',
    userId: 'u-2',
    username: 'Rizky Alfarizi',
    rating: 5,
    comment: 'Buku wajib bagi siapa saja yang mau hidup lebih santai dan tidak gampang baperan. Penyajian Henry Manampiring sangat ramah dibaca dengan ilustrasi lucu.',
    date: '2026-05-12'
  },
  {
    id: 'rev-2',
    ebookId: 'eb-1',
    userId: 'u-3',
    username: 'Nabila Az-Zahra',
    rating: 4,
    comment: 'Sangat membuka pikiran tentang dikotomi kendali. Membantu meredakan kecemasan karir saya.',
    date: '2026-06-01'
  },
  {
    id: 'rev-3',
    ebookId: 'eb-2',
    userId: 'u-4',
    username: 'Kadek Sastrawan',
    rating: 5,
    comment: 'Buku coding ter-update yang pakai React 19! Penjelasan component life dan custom hooks-nya sangat gamblang.',
    date: '2026-05-25'
  }
];
