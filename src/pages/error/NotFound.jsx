import React from "react";
import { useNavigate } from "react-router-dom";



const notFound = () => {

     const navigate = useNavigate();


  return (
    <div className="flex flex-col flex-wrap items-center justify-center min-h-screen bg-gray-900 gap-4 space-x-2 text-xl">
      <div className="text-center py-4 px-4 mx-auto w-80 text-white ">
        <div className="bg-slate-600 rounded-2xl p-10">
          <p> Neden geldin bilmiyorum ama geri dönmelisin</p>
        </div>
        <div className="bg-slate-600 rounded-2xl p-10  text-red-600 mt-4">
          <p> Burası 404 sayfası bi sorun var -_-</p>
          <button onClick={() => navigate(-1)} className="bg-white rounded-xl p-2 mt-6 text-black ">Döneyim Bari</button>
        </div>
        <div className="bg-slate-600 rounded-2xl p-10 mt-4">
          <p>
            Geliştirebileceğim fikir önerin varsa mail istediğin yerden
            ulaşabilirsin
          </p>
        </div>
      </div>
    </div>
  );
}

export default notFound;
