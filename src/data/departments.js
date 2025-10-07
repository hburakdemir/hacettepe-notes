const faculties = [
  "Alternatif Enerji Kaynakları",
  "Diş Hekimliği Fakültesi",
  "Eczacılık Fakültesi",
  "Edebiyat Fakültesi",
  "Eğitim Fakültesi",
  "Endüstri Ürünleri",
  "Elektrik",
  "Fen Fakültesi",
  "Fizik Tedavi ve Rehabilitasyon Fakültesi",
  "Güzel Sanatlar Fakültesi",
  "Hemşirelik Fakültesi",
  "Hukuk Fakültesi",
  "İktisadi ve İdari Bilimler Fakültesi",
  "İletişim Fakültesi",
  "Sağlık Bilimleri Fakültesi",
  "Spor Bilimleri Fakültesi",
  "Tıp Fakültesi",
  "Makine(OSB)",
  "Mimarlık Fakültesi",
  "Mühendislik Fakültesi",
  "Ankara Devlet Konservatuvarı",
  "Hacettepe Ankara Sanayi Odası 1.OSB Meslek Yüksekokulu",
  "Başkent OSB Teknik Bilimler Meslek Yüksekokulu",
  "Sağlık Hizmetleri Meslek Yüksekokulu",
  "Sosyal Bilimler Meslek Yüksekokulu",
  "Yabancı Diller",
];

const departments = {
    "Alternatif Enerji Kaynakları" : [
        "Alternatif Enerji Kaynakları"],
    
    "Diş Hekimliği Fakültesi": [
        "Diş Hekimliği"],

    "Eczacılık Fakültesi": [
        "Ecazacılık"],

    "Edebiyat Fakültesi": [
        "Fakülte Notu",
        "Alman Dili ve Edebiyatı", "Almanca Mütercim ve Tercümanlık", "Amerikan Kültürü ve Edebiyatı",
        "Antropoloji", "Arkeoloji", "Bilgi ve Belge Yönetimi", "Felsefe", "Fransız Dili ve Edebiyatı",
        "Fransızca Mütercim ve Tercümanlık", "Psikoloji", "Sanat Tarihi", "Sosyoloji", "Tarih",
        "Türk Dili ve Edebiyatı", "Türk Halkbilimi", "Çağdaş Türk Lehçeleri ve Edebiyatları",
        "İngiliz Dil Bilimi", "İngiliz Dili ve Edebiyatı", "İngilizce Mütercim ve Tercümanlık"
    ],
    "Eğitim Fakültesi": [
        "Fakülte Notu",
        "Alman Dili Öğretmenliği", "Bilgisayar ve Öğretim Teknolojileri Eğitimi", "Biyoloji Öğretmenliği",
        "Fen Bilgisi Öğretmenliği", "Fizik Öğretmenliği", "Fransız Dili Öğretmenliği", "Kimya Öğretmenliği",
        "Matematik Öğretmenliği", "Okul Öncesi Öğretmenliği", "Rehberlik ve Psikolojik Danışmanlık",
        "Sınıf Öğretmenliği", "Türkçe Öğretmenliği", "Özel Eğitim Öğretmenliği",
        "İlköğretim Matematik Öğretmenliği", "İngilizce Öğretmenliği"
    ],
    "Elektrik" : [
        "Elektrik"],
    "Endüstri Ürünleri" : [
        "Endüstri Ürünleri"],
    
    "Fen Fakültesi": [
        "Fakülte Notu",
        "Aktüerya Bilimleri", "Biyoloji", "Kimya", "Matematik", "İstatistik"
    ],
    "Fizik Tedavi ve Rehabilitasyon Fakültesi": [
        "Fizyoterapi ve Rehabilitasyon"
    ],
    "Güzel Sanatlar Fakültesi": [
        "Grafik", "Heykel", "Resim", "Seramik", "İç Mimarlık ve Çevre Tasarımı"
    ],
    "Hemşirelik Fakültesi": [
        "Hemşirelik"
    ],
    "Hukuk Fakültesi": ["Hukuk"],

    "İktisadi ve İdari Bilimler Fakültesi": [
        "Fakülte Notu",
        "Aile ve Tüketici Bilimleri", "Maliye", "Sağlık Yönetimi", "Siyaset Bilimi ve Kamu Yönetimi",
        "Sosyal Hizmet", "Uluslararası İlişkiler", "İktisat", "İktisat (İngilizce)", "İşletme"
    ],
    "İletişim Fakültesi": [
        "İletişim Bilimleri"
    ],
    "Makine(OSB)": [
        "Makine"],
    
    "Mühendislik Fakültesi": [
        "Fakülte Notu",
        "Bilgisayar Mühendisliği", "Elektrik-Elektronik Mühendisliği", "Endüstri Mühendisliği",
        "Fizik Mühendisliği", "Geomatik Mühendisliği", "Gıda Mühendisliği", "Jeoloji (Hidrojeoloji) Mühendisliği",
        "Jeoloji Mühendisliği", "Kimya Mühendisliği", "Maden Mühendisliği", "Makine Mühendisliği",
        "Nükleer Enerji Mühendisliği", "Yapay Zeka Mühendisliği", "Çevre Mühendisliği", "İnşaat Mühendisliği"
    ],
    "Sağlık Bilimleri Fakültesi": [
        "Fakülte Notu",
        "Beslenme ve Diyetetik", "Dil ve Konuşma Terapisi", "Ergoterapi", "Odyoloji", "Çocuk Gelişimi"
    ],
    "Spor Bilimleri Fakültesi": [
        "Fakülte Notu",
        "Antrenörlük Eğitimi", "Beden Eğitimi ve Spor Öğretmenliği", "Rekreasyon"
    ],
    "Tıp Fakültesi": [
        "Fakülte Notu",
        "Tıp (Türkçe)", "Tıp (İngilizce)"
    ],
    "Mimarlık Fakültesi": [
        "Mimarlık"
    ],
    "Ankara Devlet Konservatuvarı": [
        "Fakülte Notu",
        "Arp", "Bale", "Bando Şefliği", "Caz", "Gitar", "Kompozisyon", "Koreoloji", "Modern Dans",
        "Müzikoloji", "Nefesli Sazlar", "Opera", "Piyano", "Tiyatro", "Yaylı Sazlar"
    ],
    "Hacettepe Ankara Sanayi Odası 1.OSB Meslek Yüksekokulu": [
        "Fakülte Notu",
        "Alternatif Enerji Kaynakları Teknolojisi", "Elektrik", "Endüstri Ürünleri Tasarımı", "Makine"
    ],
    "Başkent OSB Teknik Bilimler Meslek Yüksekokulu": [
        "Fakülte Notu",
        "Bilgisayar Programcılığı", "Harita ve Kadastro", "Kaynak Teknolojisi", "Makine",
        "İklimlendirme ve Soğutma Teknolojisi", "İnşaat Teknolojisi"
    ],
    "Sağlık Hizmetleri Meslek Yüksekokulu": [
        "Fakülte Notu",
        "Ameliyathane Hizmetleri", "Ağız ve Diş Sağlığı", "Dezenfeksiyon Sterilizasyon ve Antisepsi Teknikerliği",
        "Diş Protez Teknolojisi", "Eczane Hizmetleri", "Elektronörofizyoloji", "Odyometri",
        "Ortopedik Protez ve Ortez", "Radyoterapi", "Tıbbi Dokümantasyon ve Sekreterlik",
        "Tıbbi Görüntüleme Teknikleri", "Tıbbi Laboratuvar Teknikleri", "İlk ve Acil Yardım"
    ],
    "Sosyal Bilimler Meslek Yüksekokulu": [
        "Fakülte Notu",
        "Büro Yönetimi ve Yönetici Asistanlığı", "Muhasebe ve Vergi Uygulamaları",
        "Sahne Işık ve Ses Teknolojileri", "Turizm ve Otel İşletmeciliği"
    ],
    "Yabancı Diller": [
       "Hazırlık", "Modern Diller",
    ],
};

const bolumData = { faculties, departments };

export default bolumData;