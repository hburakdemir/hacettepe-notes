import React from "react";

const Help = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center min-h-screen bg-gray-900 p-4 gap-6">
      <div className="bg-slate-600 rounded-2xl w-full sm:w-80 min-h-[16rem] flex items-center justify-center p-6 text-primary text-center overflow-auto">
        <p>
          Merhaba ben Burak Hacettepe Üniversitesi BÖTE (Bilgisayar ve Öğretim Teknolojileri Eğitimi) bölümüne 2020 yılında başladım.
          2025 Şubat ayında mezun oldum. Bu siteyi yapma amacım Hacettepe Üniversitesi öğrencilerinin notlara kolayca ulaşabilmesi ve paylaşabilmesi.
          Umarım beğenirsiniz. İyi forumlar :)
        </p>
      </div>

      <div className="bg-slate-600 rounded-2xl w-full sm:w-80 min-h-[16rem] flex items-center justify-center p-6 text-primary text-center overflow-auto">
        <p>
          Bir ekip olmadan kendi kullanımım dışında yayınlayacağım ilk websitem bu oldu.
          Bazı hatalar ve eksiklikler olabilir. Geliştirebileceğim fikir öneriniz varsa
          aşağıda iletişim bilgilerim var, istediğiniz yerden yazabilirsiniz.
        </p>
      </div>
    </div>
  );
};

export default Help;
