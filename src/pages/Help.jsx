import React from "react";
import {
  Target,
  Lightbulb,
  Mail,
  Github,
  Linkedin,
  Code2Icon,
  Megaphone,
  Bird,
  Instagram,
} from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 bg-gradient-to-b from-[#011f5e] to-[#b5c7ee] bg-clip-text text-transparent">
            Biz Kimiz
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-blue-800" />
            <h2 className="text-2xl font-bold text-white">Misyonumuz</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Bu siteyi yapma amacımız Hacettepe Üniversitesi öğrencilerinin
            notlara kolayca ulaşabilmesi ve birbirleriyle paylaşabilmesi.
            Öğrenciler arasında bilgi paylaşımını kolaylaştırmak ve akademik
            başarıya katkıda bulunmak istiyoruz.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Bird className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Projenin Hikayesi</h2>
          </div>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              Bir akşam kampüste sohbet ederken, Hacettepe Üniversitesi’nin
              çıkmış sorular, ders notları gibi kaynakların bulunduğu bir kaynak
              kütüphanesi eksikliğinden bahsediyorduk. O sırada Bora’nın “Neden
              biz böyle bir site hazırlamıyoruz?” demesiyle bu yolculuğumuz
              başladı. Sitenin ismini bulduğumuz an bile bizim için oldukça
              heyecan vericiydi. Sürecin her aşaması hem öğretici hem de ilham
              verici oldu. Bu süreçte herhangi bir maddi destek ya da sponsorluk
              almadık. Tamamen kendi çabalarımızla bu siteyi hazırladık. Yazılım
              ve tasarım kısmıyla Burak, tanıtım ve içerik kısmıyla ise Bora ilgilendi. Ve
              sonunda, sizlerin karşısına çıktığımız bu haline ulaştık.
            </p>
            <p className="leading-relaxed">
              Projemizi "Daha ileriye... en iyiye" mottosuyla geliştirmeye devam
              ediyoruz. Bu süreçte sizlerin görüşlerine ve tavsiyelerine
              ihtiyacımız var. Projemizin Hacettepe öğrencileri için daha
              faydalı hale gelmesi adına fikirlerinizi, önerilerinizi ve hatta
              eleştirilerinizi bizimle paylaşmaktan çekinmeyin. Gelen her mesajı
              dikkatle okuyup dönüş yapıyoruz, çünkü sizlerin katkısı bu
              projenin en değerli parçası.
            </p>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500 p-4 rounded-r-lg mt-6">
              <p className="text-blue-300 italic">
                "Umarım bu platform sizin için faydalı olur. İyi forumlar! "
              </p>
            </div>
          </div>
        </div>
        <div className="mb-12">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden">
                  <img
                    src="/images/burak.jpg"
                    alt="Burak Ryder"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Burak</h3>
                  <p className="text-blue-300 italic">Developer & Designer</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Code2Icon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-300 leading-relaxed">
                      Hacettepe BÖTE (Bİlgisayar ve Öğretim Teknolojileri)
                      2020-2025 Aktif iş arayış sürecim devam etmektedir,
                      yönlendirebileceğiniz kişiler olursa sevinirim.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden">
                  <img
                    src="/images/bora.jpg"
                    alt="Bilal Bora Sağlam"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Bilal Bora Sağlamm
                  </h3>
                  <p className="text-blue-300 italic">Fikir & Reklam</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Megaphone className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-300 leading-relaxed">
                      2018 yılında Hacettepe'yi kazanmış olup hala aktif olarak
                      Hacettepe öğrencisi. <br />
                      Hacettepe Üniversitesi Cumhuriyet Değerleri Topluluğu
                      2024-2025 ve 2025-2026 yönetim kurulu başkanı.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            İletişim
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-3xl p-8 shadow-2xl border border-blue-500/30 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Burak
              </h3>
              <div className="flex flex-col gap-4">
                <a
                  href="mailto:buradk279@gmail.com"
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  <span>burakd279@gmail.com</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/hburakdmr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>Hakan Burak Demir</span>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-3xl p-8 shadow-2xl border border-blue-500/30 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Bilal Bora Sağlam
              </h3>
              <div className="flex flex-col gap-4">
                <a
                  href="http://www.instagram.com/hacettepecumhuriyet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Hacettepe Cumhuriyet</span>
                </a>
                <a
                  href="http://www.instagram.com/bborasu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Bborasu</span>
                </a>
                <a
                  href="bilalborasaglam@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  <span>bilalborasaglam@gmail.com</span>
                </a>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
